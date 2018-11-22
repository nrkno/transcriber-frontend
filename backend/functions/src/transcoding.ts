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
async function reencodeToM4a(tempFilePath: string, targetTempFilePath: string, id: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(tempFilePath)
      .setFfmpegPath(ffmpeg_static.path)
      .format("aac")
      .on("error", err => {
        reject(err)
      })
      .on("end", () => {
        resolve()
      })
      .save(targetTempFilePath)
  })
}

/**
 * When an audio is uploaded in the Storage bucket we generate a mono channel audio automatically using
 * node-fluent-ffmpeg.
 */
export async function transcode(id: string): Promise<string> {
  // Getting the bucket reference from Google Cloud Runtime Configuration API

  const bucketName = functions.config().bucket.name

  if (bucketName === undefined) {
    throw Error("Environment variable 'bucket.name' not set up")
  }
  const bucket = storage.bucket(bucketName)

  // -----------------
  // 1. Check metadata
  // -----------------

  // Check if ownedBy is present

  const file = bucket.file(`incoming/${id}`)

  const metadataPromise = await file.getMetadata()

  const fileMetadata = metadataPromise[0]

  // Exit if owned by is missing
  if (fileMetadata.metadata === undefined || fileMetadata.metadata.ownedBy === undefined) {
    throw new Error("Metadata missing from uploaded file")
  }

  // Check if it's an audio file

  const contentType = fileMetadata.contentType

  // Exit if this is triggered on a file that is not an audio.
  if (contentType === undefined || !contentType.startsWith("audio/")) {
    throw Error("Uploaded file is not an audio file")
  }

  // ---------------------------------
  // 2. Move file into users directory
  // ---------------------------------

  const ownedBy = fileMetadata.metadata.ownedBy

  const movedFile = await file.move(`media/${ownedBy}`)

  return ""
  /*
  // Download file from uploads bucket.
  const tempFilePath = path.join(os.tmpdir(), fileName)
  // We add a '.flac' suffix to target audio file name. That's where we'll upload the converted audio.
  const targetTempFileName = fileName.replace(/\.[^/.]+$/, "") + ".flac"
  const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName)
  const targetStorageFilePath = path.join(path.dirname(id), targetTempFileName)

  await bucket.file(`incoming/${id}`).download({ destination: tempFilePath })

  console.log("Audio downloaded locally to", tempFilePath)

  // Convert the audio to mono channel using FFMPEG.
  await reencodeToFlacMono(tempFilePath, targetTempFilePath, id)

  console.log("Output audio created at", targetTempFilePath)

  // Getting the bucket reference from Google Cloud Runtime Configuration API
  const transcodedBucketReference = functions.config().bucket.transcoded

  if (transcodedBucketReference === undefined) {
    throw Error("Environment variable 'bucket.transcoded' not set up")
  }

  const transcodedBucket = storage.bucket(transcodedBucketReference)

  // Uploading the audio to transcoded bucket.
  const [transcodedFile] = await transcodedBucket.upload(targetTempFilePath, {
    destination: targetStorageFilePath,
    resumable: false,
  })

  console.log("Output audio uploaded to", targetStorageFilePath)

  // Once the audio has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath)
  fs.unlinkSync(targetTempFilePath)

  console.log("Temporary files removed.", targetTempFilePath)

  // Finally, transcribe the transcoded audio file

  console.log(transcodedFile)

  if (transcodedFile.metadata === undefined) {
    throw new Error("Metadata missing on transcoded file")
  }

  const bucket = transcodedFile.metadata.bucket
  const name = transcodedFile.metadata.name

  if (bucket === undefined || name === undefined) {
    throw new Error("Error in metadata on transcoded file")
  }

  return `gs://${bucket}/${name}`

  */
}
