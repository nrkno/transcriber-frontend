import * as speech from "@google-cloud/speech"
import * as ffmpegStatic from "ffmpeg-static"
import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import { ObjectMetadata } from "firebase-functions/lib/providers/storage"
import * as ffmpeg from "fluent-ffmpeg"
import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import { Status } from "./enums"
import { ITranscription } from "./interfaces"

admin.initializeApp(functions.config().firebase)
const client = new speech.v1p1beta1.SpeechClient()
const database = admin.database()

///////////////////
// TRANSCRIPTION //
///////////////////

async function saveResult(speechRecognitionResults: any, id: string) {
  console.log("length", speechRecognitionResults.length)

  await updateTranscript(id, {
    progress: {
      percent: 0,
      status: "saving"
    },
    "timestamps/transcribedAt": admin.database.ServerValue.TIMESTAMP
  })

  // Flattening the structure

  for (const index of speechRecognitionResults.keys()) {
    const words = speechRecognitionResults[index].alternatives[0].words

    database
      .ref(`/transcripts/${id}/text`)
      .push(JSON.parse(JSON.stringify(words)))

    const percent = Math.round(
      ((index + 1) / speechRecognitionResults.length) * 100
    )

    if (index + 1 < speechRecognitionResults.length) {
      await updateTranscript(id, {
        "progress/percent": percent
      })
    } else {
      await updateTranscript(id, {
        progress: { status: "success" },
        "timestamps/savedAt": admin.database.ServerValue.TIMESTAMP
      })
    }
  }
}

async function trans(operation, id: string) {
  return new Promise((resolve, reject) => {
    // Adding a listener for the "complete" event starts polling for the
    // completion of the operation.
    operation.on(
      "complete",
      (
        longRunningRecognizeResponse,
        longRunningRecognizeMetadata,
        finalApiResponse
      ) => {
        const speechRecognitionResults = longRunningRecognizeResponse.results

        resolve(speechRecognitionResults)
      }
    )

    // Adding a listener for the "progress" event causes the callback to be
    // called on any change in metadata when the operation is polled.
    operation.on(
      "progress",
      async (longRunningRecognizeMetadata, apiResponse) => {
        const percent = longRunningRecognizeMetadata.progressPercent
        if (percent !== undefined) {
          await updateTranscript(id, {
            "progress/percent": percent
          })
        }

        console.log("progress", longRunningRecognizeMetadata, apiResponse)
      }
    )

    // Adding a listener for the "error" event handles any errors found during polling.
    operation.on("error", (error: Error) => {
      reject(error)
    })
  })
}

async function transcribe(id: string, gcsUri: string, languageCode: string) {
  console.log("Start transcribing", id, languageCode)

  await updateTranscript(id, {
    progress: { status: "transcribing", percent: 0 },
    "timestamps/transcodedAt": admin.database.ServerValue.TIMESTAMP
  })

  const request = {
    audio: { uri: gcsUri },
    config: {
      enableAutomaticPunctuation: true, // Only working for en-US at the moment
      enableWordTimeOffsets: true,
      languageCode
    }
  }

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.

  const responses = await client.longRunningRecognize(request)

  const operation = responses[0]

  console.log("operation", operation)

  const speechRecognitionResults = await trans(operation, id)

  return speechRecognitionResults
}

/////////////
// HELPERS //
/////////////

function hoursMinutesSecondsToSeconds(duration: string): number {
  const [hours, minutes, seconds] = duration.split(":")

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds)
}

async function updateTranscript(id: string, data: object) {
  await database.ref(`/transcripts/${id}`).update({ ...data })
}

/////////////////
// TRANSCODING //
/////////////////

/**
 * Utility method to convert audio to mono channel using FFMPEG.
 */
async function reencodeAsync(
  tempFilePath: string,
  targetTempFilePath: string,
  id: string
) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(tempFilePath)
      .setFfmpegPath(ffmpegStatic.path)
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
            "audioFile/durationInSeconds": durationInSeconds
          })
        } catch (error) {
          console.error(error)
        }
      })
      .save(targetTempFilePath)
  })
}

/**
 * When an audio is uploaded in the Storage bucket We generate a mono channel audio automatically using
 * node-fluent-ffmpeg.
 */

async function transcodeAudio(languageCode: string, id: string) {
  // Getting the bucket reference from Google Cloud Runtime Configuration API

  const uploadsBucketReference = functions.config().bucket.uploads

  if (uploadsBucketReference === undefined) {
    throw Error("Environment variable 'bucket.upload' not set up")
  }
  const uploadsBucket = admin.storage().bucket(uploadsBucketReference)

  // Write status to Firebase
  await updateTranscript(id, {
    progress: { status: "transcoding" }
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
  await reencodeAsync(tempFilePath, targetTempFilePath, id)

  console.log("Output audio created at", targetTempFilePath)

  // Getting the bucket reference from Google Cloud Runtime Configuration API
  const transcodedBucketReference = functions.config().bucket.transcoded

  if (transcodedBucketReference === undefined) {
    throw Error("Environment variable 'bucket.transcoded' not set up")
  }

  const transcodedBucket = admin.storage().bucket(transcodedBucketReference)

  // Uploading the audio to transcoded bucket.
  const [transcodedFile] = await transcodedBucket.upload(targetTempFilePath, {
    destination: targetStorageFilePath,
    resumable: false
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
exports.transcription = functions.database
  .ref("/transcripts/{id}")
  .onCreate(async (dataSnapshot, eventContext) => {
    const id = dataSnapshot.key

    try {
      const transcript = dataSnapshot.val() as ITranscription

      if (transcript === undefined) {
        throw Error("Transcript missing")
      }

      const languageCode = transcript.audioFile.languageCode

      console.log(
        `Deployed 05.06.2018 08:20 - Start transcription of id ${id} with ${languageCode} `
      )

      // First, check if status is "uploaded", otherwise, cancel

      if (transcript.progress.status !== Status.Uploaded) {
        console.error("Transcript already processed")
        return null
      }

      // 1. Transcode

      const gcsUri = await transcodeAudio(languageCode, id)

      // 2. Transcribe

      const speechRecognitionResults = await transcribe(
        id,
        gcsUri,
        languageCode
      )

      // 3. Save transcription

      await saveResult(speechRecognitionResults, id)

      console.log("End transcribing", id)
    } catch (error) {
      console.error(error)

      await updateTranscript(id, {
        error: JSON.parse(JSON.stringify(error)),
        progress: {
          percent: null,
          status: "failed"
        }
      })

      return null
    }
  })

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at: Promise", promise, "reason:", reason)
  console.error(reason.stack)
  // application specific logging, throwing an error, or other logic here
})
