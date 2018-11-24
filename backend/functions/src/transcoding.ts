/**
 * @file Converts uploaded audio to mono channel using FFmpeg
 * @author Andreas Schjønhaug
 */

import ffmpeg_static from "ffmpeg-static"
import * as functions from "firebase-functions"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import os from "os"
import path from "path"
import database from "./database"
import { hoursMinutesSecondsToSeconds } from "./helpers"
import { storage } from "./storage"

/**
 * Utility method to convert audio to mono channel using FFMPEG.
 */
async function reencodeToFlacMono(tempFilePath: string, targetTempFilePath: string, id: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(tempFilePath)
      .setFfmpegPath(ffmpeg_static.path)
      .audioChannels(1)
      .audioFrequency(16000)
      .format("flac")
      .on("error", err => {
        reject(err)
      })
      .on("end", () => {
        resolve()
      })
      .on("codecData", async data => {
        // Saving duration to database
        const duration = hoursMinutesSecondsToSeconds(data.duration)
        try {
          await database.setDuration(id, duration)
        } catch (error) {
          console.log("Error in transcoding on('codecData')")
          console.error(error)
        }
      })
      .save(targetTempFilePath)
  })
}

/**
 * Utility method to convert audio to MP4.
 */
async function reencodeToM4a(input: string, output: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .setFfmpegPath(ffmpeg_static.path)
      .format("mp4")
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
export async function transcode(transcriptId: string, userId: string): Promise<string> {
  // Getting the bucket reference from Google Cloud Runtime Configuration API

  const bucketName = functions.config().bucket.name

  if (bucketName === undefined) {
    throw Error("Environment variable 'bucket.name' not set up")
  }
  const bucket = storage.bucket(bucketName)

  // -----------------------------------
  // 1. Check that we have an audio file
  // -----------------------------------

  const mediaPath = path.join("media", userId)

  const file = bucket.file(path.join(mediaPath, transcriptId))

  const [fileMetadata] = await file.getMetadata()

  const contentType = fileMetadata.contentType

  // Exit if this is triggered on a file that is not an audio.
  if (contentType === undefined || !contentType.startsWith("audio/")) {
    throw Error("Uploaded file is not an audio file")
  }

  // ------------------------------
  // 2. Download file and transcode
  // ------------------------------

  const tempFilePath = path.join(os.tmpdir(), transcriptId)

  await file.download({ destination: tempFilePath })

  console.log("Audio downloaded locally to", tempFilePath)

  // Transcode to m4a

  const playbackFileName = `${transcriptId}.m4a`
  const playbackTempFilePath = path.join(os.tmpdir(), playbackFileName)

  await reencodeToM4a(tempFilePath, playbackTempFilePath)

  const playbackStorageFilePath = path.join(mediaPath, playbackFileName)

  const [playbackFile] = await bucket.upload(playbackTempFilePath, {
    destination: playbackStorageFilePath,
    resumable: false,
  })
  console.log("Uploaded m4a to ", playbackStorageFilePath)

  await playbackFile.makePublic()

  const playbackUrl = path.join("https://storage.googleapis.com", bucketName, mediaPath, playbackFileName)

  console.log("Playback url ", playbackUrl)
  await database.setPlaybackUrl(transcriptId, playbackUrl)

  // Transcode to FLAC mono

  const transcribeFileName = `${transcriptId}.flac`
  const transcribeTempFilePath = path.join(os.tmpdir(), transcribeFileName)

  await reencodeToFlacMono(tempFilePath, transcribeTempFilePath, transcriptId)

  const targetStorageFilePath = path.join(mediaPath, transcribeFileName)

  await bucket.upload(transcribeTempFilePath, {
    destination: targetStorageFilePath,
    resumable: false,
  })

  console.log("Output flac to", targetStorageFilePath)

  // Once the audio has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath)
  fs.unlinkSync(playbackTempFilePath)
  fs.unlinkSync(transcribeTempFilePath)

  return `gs://${bucket.name}/${targetStorageFilePath}`
}
