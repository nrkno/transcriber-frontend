/**
 * @file Google Cloud function
 * @author Andreas Schjønhaug
 */

import * as functions from "firebase-functions"
import { Status } from "./enums"
import { updateTranscript } from "./helpers"
import { ITranscription } from "./interfaces"
import { saveResult } from "./persistence"
import { transcode } from "./transcoding"
import { transcribe } from "./transcription"

exports.transcription = functions.database.ref("/transcripts/{id}").onCreate(async (dataSnapshot, eventContext) => {
  const id = dataSnapshot.key

  try {
    const transcript = dataSnapshot.val() as ITranscription

    if (transcript === undefined) {
      throw Error("Transcript missing")
    }

    const languageCode = transcript.audioFile.languageCode

    console.log(`Deployed 15:47 - Start transcription of id ${id} with ${languageCode} `)

    // First, check if status is "uploaded", otherwise, cancel

    if (transcript.progress.status !== Status.Uploaded) {
      throw new Error("Transcript already processed")
    }

    // 1. Transcode

    const gcsUri = await transcode(id)

    // 2. Transcribe

    const speechRecognitionResults = await transcribe(id, gcsUri, languageCode)

    // 3. Save transcription

    await saveResult(speechRecognitionResults, id)

    console.log("End transcribing", id)
  } catch (error) {
    console.log("Error in main function")
    console.error(error)

    await updateTranscript(id, {
      error: JSON.parse(JSON.stringify(error)),
      progress: {
        percent: null,
        status: "failed",
      },
    })

    throw error
  }
})

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`))
})
