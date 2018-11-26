/**
 * @file Google Cloud function
 * @author Andreas Schjønhaug
 */

import * as functions from "firebase-functions"
import exportToDoc from "./exportToDoc"
import transcription from "./transcription"

// Transcription

exports.transcription = functions
  .region("europe-west1")
  .firestore.document("transcripts/{transcriptId}")
  .onCreate(transcription)

// Export to Doc

exports.exportToDoc = functions.region("europe-west1").https.onRequest(exportToDoc)

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`))
})
