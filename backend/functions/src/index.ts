import speech from "@google-cloud/speech"
import * as functions from "firebase-functions"
import { database, timestamp } from "./database"
import { Status } from "./enums"
import { updateTranscript } from "./helpers"
import { ITranscription } from "./interfaces"
import { transcode } from "./transcoding"

const client = new speech.v1p1beta1.SpeechClient()

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
    "timestamps/transcribedAt": timestamp
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
        "timestamps/savedAt": timestamp
      })
    }
  }
}

async function trans(operation, id: string) {
  return new Promise((resolve, reject) => {
    operation
      .on(
        "complete",
        (
          longRunningRecognizeResponse,
          longRunningRecognizeMetadata,
          finalApiResponse
        ) => {
          // Adding a listener for the "complete" event starts polling for the
          // completion of the operation.

          const speechRecognitionResults = longRunningRecognizeResponse.results
          resolve(speechRecognitionResults)
        }
      )
      .on("progress", async (longRunningRecognizeMetadata, apiResponse) => {
        // Adding a listener for the "progress" event causes the callback to be
        // called on any change in metadata when the operation is polled.

        const percent = longRunningRecognizeMetadata.progressPercent
        if (percent !== undefined) {
          try {
            await updateTranscript(id, {
              "progress/percent": percent
            })
          } catch (error) {
            console.error(error)
          }
        }
        console.log("progress", longRunningRecognizeMetadata, apiResponse)
      })
      .on("error", (error: Error) => {
        // Adding a listener for the "error" event handles any errors found during polling.
        reject(error)
      })
  })
}

async function transcribe(id: string, gcsUri: string, languageCode: string) {
  console.log("Start transcribing", id, languageCode)

  await updateTranscript(id, {
    progress: { status: "transcribing", percent: 0 },
    "timestamps/transcodedAt": timestamp
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
        `Deployed 10:58 - Start transcription of id ${id} with ${languageCode} `
      )

      // First, check if status is "uploaded", otherwise, cancel

      if (transcript.progress.status !== Status.Uploaded) {
        throw new Error("Transcript already processed")
      }

      // 1. Transcode

      const gcsUri = await transcode(id)

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

      throw error
    }
  })

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(
    new Error(
      `Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack ||
        reason}`
    )
  )
})
