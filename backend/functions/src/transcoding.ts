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
import { storage } from "./database"
import { hoursMinutesSecondsToSeconds, updateTranscript } from "./helpers"

/**
 * Utility method to convert audio to mono channel using FFMPEG.
 */
async function reencode(tempFilePath: string, targetTempFilePath: string, id: string) {
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
        const durationInSeconds = hoursMinutesSecondsToSeconds(data.duration)
        try {
          await updateTranscript(id, {
            "audioFile/durationInSeconds": durationInSeconds,
          })
        } catch (error) {
          console.log("Error in transcoding on('codecData')")
          console.error(error)
        }
      })
      .save(targetTempFilePath)
  })
}

/**
 * When an audio is uploaded in the Storage bucket we generate a mono channel audio automatically using
 * node-fluent-ffmpeg.
 */
export async function transcode(id: string) {
  // Getting the bucket reference from Google Cloud Runtime Configuration API

  const uploadsBucketReference = functions.config().bucket.uploads

  if (uploadsBucketReference === undefined) {
    throw Error("Environment variable 'bucket.upload' not set up")
  }
  const uploadsBucket = storage.bucket(uploadsBucketReference)

  // Write status to Firebase
  await updateTranscript(id, {
    progress: { status: "transcoding" },
  })

  /*const fileBucket = objectMetaData.bucket // The Storage bucket that contains the file.
    const contentType = objectMetaData.contentType // File content type.
  
    // Exit if this is triggered on a file that is not an audio.
    if (contentType === undefined || !contentType.startsWith("audio/")) {
      throw Error("Uploaded file is not audio")
    }
  */
  // Get the file name.
  const fileName = path.basename(id)

  // Download file from uploads bucket.
  const tempFilePath = path.join(os.tmpdir(), fileName)
  // We add a '.flac' suffix to target audio file name. That's where we'll upload the converted audio.
  const targetTempFileName = fileName.replace(/\.[^/.]+$/, "") + ".flac"
  const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName)
  const targetStorageFilePath = path.join(path.dirname(id), targetTempFileName)

  await uploadsBucket.file(id).download({ destination: tempFilePath })

  console.log("Audio downloaded locally to", tempFilePath)

  // Convert the audio to mono channel using FFMPEG.
  await reencode(tempFilePath, targetTempFilePath, id)

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

  const bucket = (transcodedFile.metadata as any).bucket
  const name = (transcodedFile.metadata as any).name

  const gcsUri = `gs://${bucket}/${name}`

  return gcsUri
}
