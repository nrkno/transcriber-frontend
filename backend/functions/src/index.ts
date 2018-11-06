/**
 * @file Google Cloud function
 * @author Andreas Schjønhaug
 */

import { Document, Packer, Paragraph } from "docx"
import * as functions from "firebase-functions"
import serializeError from "serialize-error"
import database from "./database"
import { Status } from "./enums"
import { ITranscription } from "./interfaces"
import { saveResult } from "./persistence"
import { transcode } from "./transcoding"
import { transcribe } from "./transcription"

exports.transcription = functions
  .region("europe-west1")
  .database.ref("/transcripts/{id}")
  .onCreate(async (dataSnapshot, eventContext) => {
    const id = dataSnapshot.key

    console.log(`Deployed 09:08 - Start transcription of id: ${id}`)

    try {
      // Because of indempotency, we need to fetch the transcript from the server and check if it's already in process
      const status = await database.getStatus(id)
      if (status !== Status.Analysing) {
        console.warn("Transcript already processed, returning")
        return
      }

      const transcript = dataSnapshot.val() as ITranscription

      if (transcript === undefined) {
        throw Error("Transcript missing")
      }

      const languageCode = transcript.audioFile.languageCode

      // 1. Transcode

      await database.setStatus(id, Status.Transcoding)
      const gcsUri = await transcode(id)

      // 2. Transcribe

      await database.setStatus(id, Status.Transcribing)
      const speechRecognitionResults = await transcribe(id, gcsUri, languageCode)

      // 3. Save transcription

      await database.setStatus(id, Status.Saving)
      await saveResult(speechRecognitionResults, id)

      // 4. Done

      await database.setStatus(id, Status.Success)
      console.log("End transcribing with id: ", id)
    } catch (error) {
      console.log("Error in main function")
      console.error(error)

      await database.errorOccured(id, error)

      throw error
    }
  })

exports.exportToDoc = functions.region("europe-west1").https.onRequest(async (request, response: functions.Response) => {
  try {
    console.log("export 14:07")

    if (!request.query.id) {
      throw new Error("ID missing")
    }

    console.log(request.query.id)

    const text = await database.downloadText(request.query.id)

    const results = text.val()

    console.log("results")
    console.log(results)

    const doc = new Document()

    Object.values(results).map((result, i) => {
      console.log("result, i")
      console.log(result, i)

      let seconds = 0

      if (result[0].startTime && result[0].startTime.seconds) {
        seconds = parseInt(result[0].startTime.seconds, 10)
      }

      const startTime = new Date(seconds * 1000).toISOString().substr(11, 8)

      console.log("startTime")
      console.log(startTime)

      if (i > 0) {
        doc.addParagraph(new Paragraph(startTime))
      }

      const words = Object.values(result)
        .map(word => word.word)
        .join(" ")

      console.log("words")
      console.log(words)

      doc.addParagraph(new Paragraph(words))
    })

    const packer = new Packer()

    const b64string = await packer.toBase64String(doc)
    response.setHeader("Content-Disposition", "attachment; filename=Transcript.docx")
    response.send(Buffer.from(b64string, "base64"))
  } catch (error) {
    // Handle the error
    console.log(error)
    response.status(500).send(serializeError(error))
  }
})

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`))
})
