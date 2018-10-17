/**
 * @file Google Cloud function
 * @author Andreas Schjønhaug
 */

import { Document, Packer, Paragraph } from "docx"
import * as functions from "firebase-functions"
import { flatten } from "lodash"
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

    try {
      const transcript = dataSnapshot.val() as ITranscription

      if (transcript === undefined) {
        throw Error("Transcript missing")
      }

      const languageCode = transcript.audioFile.languageCode

      console.log(`Deployed 13:09 - Start transcription of id ${id} with ${languageCode} `)

      // First, check if status is "analysing", otherwise, cancel

      if (transcript.progress.status !== Status.Analysing) {
        throw new Error("Transcript already processed")
      }

      // 1. Transcode

      await database.updateStatus(id, Status.Transcoding)
      const gcsUri = await transcode(id)

      // 2. Transcribe

      await database.updateStatus(id, Status.Transcribing)
      const speechRecognitionResults = await transcribe(id, gcsUri, languageCode)

      // 3. Save transcription

      await database.updateStatus(id, Status.Saving)
      await saveResult(speechRecognitionResults, id)

      // 4. Done

      await database.updateStatus(id, Status.Success)
      console.log("End transcribing", id)
    } catch (error) {
      console.log("Error in main function")
      console.error(error)

      await database.errorOccured(id, error)

      throw error
    }
  })
/*
exports.exportToDoc2 = functions.region("europe-west1").https.onCall(async (data, context) => {
  const doc = new Document()

  console.log("export 14:07")

  const paragraph = new Paragraph("Hello World from Cloud functions using onCall yes")

  doc.addParagraph(paragraph)
  const packer = new Packer()

  const b64string = await packer.toBase64String(doc)

  if (context.rawRequest.res) {
    context.rawRequest.res.setHeader("Content-Disposition", "attachment; filename=My Document.docx")
    context.rawRequest.res.send(Buffer.from(b64string, "base64"))
  }

  return context.rawRequest.res
})
 
exports.exportToDoc = functions.region("europe-west1").https.onRequest(async (request, response: functions.Response) => {
  console.log("export 14:23")

  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Content-Type header
  // and caches preflight response for 3600s

  response.set("Access-Control-Allow-Origin", "*")

  if (request.method === "OPTIONS") {
    // Send response to OPTIONS requests
    response.set("Access-Control-Allow-Methods", "GET")
    response.set("Access-Control-Allow-Headers", "Content-Type")
    response.set("Access-Control-Max-Age", "3600")
    response.status(204).send("")
  } else {
    try {
      // Set CORS headers for the main request
      response.set("Access-Control-Allow-Origin", "*")
      // response.send("Hello World! CORS")

      const doc = new Document()

      const paragraph = new Paragraph("Hello World from Cloud functions")

      doc.addParagraph(paragraph)
      const packer = new Packer()

      const b64string = await packer.toBase64String(doc)
      response.setHeader("Content-Disposition", "attachment; filename=My Document.docx")
      response.send(Buffer.from(b64string, "base64"))
    } catch (error) {
      // Handle the error
      console.log(error)
      response.status(500).send(error)
    }
  }
})

*/

exports.exportToDoc = functions.region("europe-west1").https.onRequest(async (request, response: functions.Response) => {
  try {
    console.log("export 16:16")

    if (!request.query.id) {
      throw new Error("ID missing")
    }

    console.log(request.query.id)

    const result = await database.downloadText(request.query.id)

    const text = result.val()

    const textAsArray = flatten(Object.keys(text).map(key => text[key])).map(word => word.word)
    const wordsAsString = textAsArray.join(" ")

    // Export to Word

    const doc = new Document()

    const paragraph = new Paragraph(wordsAsString)

    doc.addParagraph(paragraph)
    const packer = new Packer()

    const b64string = await packer.toBase64String(doc)
    response.setHeader("Content-Disposition", "attachment; filename=My Document.docx")
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
