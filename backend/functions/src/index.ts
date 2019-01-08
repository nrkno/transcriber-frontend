/**
 * @file Google Cloud function
 * @author Andreas Schjønhaug
 */

import * as functions from "firebase-functions"
import deleteTranscript from "./deleteTranscript"
import exportToDoc from "./exportToDoc"
import transcription from "./transcription"

// -------------
// Create transcription
// -------------

exports.transcription = functions
  .region("europe-west1")
  .firestore.document("transcripts/{transcriptId}")
  .onCreate(transcription)

// -------------
// Delete transcription
// -------------

exports.deleteTranscript = functions
  .runWith({
    memory: "2GB",
    timeoutSeconds: 540,
  })
  .region("europe-west1")
  .https.onCall(deleteTranscript)

// -------------
// Export to doc
// -------------

exports.exportToDoc = functions.region("europe-west1").https.onRequest(exportToDoc)

// Catch unhandled rejections
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`))
})
