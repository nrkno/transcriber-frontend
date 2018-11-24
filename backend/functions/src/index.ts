/**
 * @file Google Cloud function
 * @author Andreas Schjønhaug
 */

import * as functions from "firebase-functions"
import serializeError from "serialize-error"
import database from "./database"
import { Status } from "./enums"
import exportToDoc from "./exportToDoc"
import { ITranscript } from "./interfaces"
import { saveResult } from "./persistence"
import { transcode } from "./transcoding"
import { transcribe } from "./transcription"

exports.transcription = functions
  .region("europe-west1")
  .firestore.document("transcripts/{transcriptId}")
  .onCreate(async (documentSnapshot, eventContext) => {
    const transcriptId = documentSnapshot.id

    console.log(`Deployed 15:53 - Start transcription of id: ${transcriptId}`)

    try {
      // Because of indempotency, we need to fetch the transcript from the server and check if it's already in process
      const status = await database.getStatus(transcriptId)
      if (status !== Status.Uploading) {
        console.warn("Transcript already processed, returning")
        return
      }

      const transcript = documentSnapshot.data() as ITranscript

      if (transcript === undefined || transcript.userId === undefined) {
        throw Error("Transcript or user id missing")
      }

      const languageCodes = transcript.languageCodes

      // 1. Transcode

      await database.setStatus(transcriptId, Status.Transcoding)
      const uri = await transcode(transcriptId, transcript.userId)

      // 2. Transcribe

      await database.setStatus(transcriptId, Status.Transcribing)
      const speechRecognitionResults = await transcribe(transcriptId, transcript, uri)

      // 3. Save transcription

      await database.setStatus(transcriptId, Status.Saving)
      await saveResult(speechRecognitionResults, transcriptId)

      // 4. Done

      await database.setStatus(transcriptId, Status.Success)
      console.log("End transcribing with id: ", transcriptId)
    } catch (error) {
      console.log("Error in main function")
      console.error(error)

      await database.errorOccured(transcriptId, error)

      throw error
    }
  })

exports.exportToDoc = functions.region("europe-west1").https.onRequest(async (request, response: functions.Response) => {
  try {
    console.log("export 17:37")

    if (!request.query.id) {
      throw new Error("ID missing")
    }

    await exportToDoc(request.query.id, response)
  } catch (error) {
    // Handle the error
    console.log(error)
    response.status(500).send(serializeError(error))
  }
})

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`))
})
