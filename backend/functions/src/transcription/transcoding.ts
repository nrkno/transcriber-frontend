/**
 * @file Converts uploaded audio to mono channel using FFmpeg
 * @author Andreas Schjønhaug
 */

import ffmpeg_static from "ffmpeg-static"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import os from "os"
import path from "path"
import database from "../database"
import { hoursMinutesSecondsToSeconds } from "./helpers"
import { bucket, bucketName } from "./storage"

let audioDuration: number

interface IDurationAndGsUrl {
  audioDuration: number
  gsUri: string
}

/**
 * Utility method to convert audio to mono channel using FFMPEG.
 *
 * Command line equivalent:
 * ffmpeg -i input -y -ac 1 -vn -f flac output
 *
 */
async function reencodeToFlacMono(tempFilePath: string, targetTempFilePath: string, transcriptId: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(tempFilePath)
      .setFfmpegPath(ffmpeg_static.path)
      .audioChannels(1)
      .noVideo()
      .format("flac")
      /*DEBUG
      .on("start", commandLine => {
        console.log("flac: Spawned Ffmpeg with command: " + commandLine)
      })*/
      .on("error", err => {
        reject(err)
      })
      .on("end", () => {
        resolve()
      })
      .on("codecData", async data => {
        // Saving duration to database
        audioDuration = hoursMinutesSecondsToSeconds(data.duration)
        try {
          await database.setDuration(transcriptId, audioDuration)
        } catch (error) {
          console.log(transcriptId, "Error in transcoding on('codecData')", error)
        }
      })
      .save(targetTempFilePath)
  })
}

/**
 * Utility method to convert audio to MP4.
 *
 * Command line equivalent:
 * ffmpeg -i input -y -ac 2 -vn -f mp4 output.m4a
 *
 */
async function reencodeToM4a(input: string, output: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .setFfmpegPath(ffmpeg_static.path)
      .audioChannels(2)
      .noVideo()
      .format("mp4")
      /* DEBUG
      .on("start", commandLine => {
        console.log("mp4: Spawned Ffmpeg with command: " + commandLine)
      })*/
      .on("error", err => {
        reject(err)
      })
      .on("end", () => {
        resolve()
      })
      .save(output)
  })
}

/**
 * When an audio is uploaded in the Storage bucket we generate a mono channel audio automatically using
 * node-fluent-ffmpeg.
 */
export async function transcode(transcriptId: string, userId: string): Promise<IDurationAndGsUrl> {
  // -----------------------------------
  // 1. Check that we have an audio file
  // -----------------------------------

  const mediaPath = path.join("media", userId)

  const file = bucket.file(path.join(mediaPath, `${transcriptId}-original`))

  const [fileMetadata] = await file.getMetadata()

  const contentType = fileMetadata.contentType

  // Exit if this is triggered on a file that is not audio.
  if (contentType === undefined || (!contentType.startsWith("audio/") && !contentType.startsWith("video/") && contentType !== "application/mxf")) {
    throw Error("Uploaded file is not an audio or video file")
  }

  // ------------------------------
  // 2. Download file and transcode
  // ------------------------------

  const tempFilePath = path.join(os.tmpdir(), transcriptId)

  await file.download({ destination: tempFilePath })

  // Transcode to m4a

  const playbackFileName = `${transcriptId}-playback.m4a`
  const playbackTempFilePath = path.join(os.tmpdir(), playbackFileName)

  await reencodeToM4a(tempFilePath, playbackTempFilePath)

  const playbackStorageFilePath = path.join(mediaPath, playbackFileName)

  const [playbackFile] = await bucket.upload(playbackTempFilePath, {
    destination: playbackStorageFilePath,
    resumable: false,
  })

  const playbackGsUrl = "gs://" + path.join(bucketName, mediaPath, playbackFileName)

  await database.setPlaybackGsUrl(transcriptId, playbackGsUrl)

  // Transcode to FLAC mono

  const transcribeFileName = `${transcriptId}-transcribed.flac`
  const transcribeTempFilePath = path.join(os.tmpdir(), transcribeFileName)

  await reencodeToFlacMono(tempFilePath, transcribeTempFilePath, transcriptId)

  const targetStorageFilePath = path.join(mediaPath, transcribeFileName)

  await bucket.upload(transcribeTempFilePath, {
    destination: targetStorageFilePath,
    resumable: false,
  })

  // Once the audio has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath)
  fs.unlinkSync(playbackTempFilePath)
  fs.unlinkSync(transcribeTempFilePath)

  return {
    audioDuration,
    gsUri: `gs://${bucketName}/${targetStorageFilePath}`,
  }
}
