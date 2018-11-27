/**
 * @file Google Cloud function
 * @author Andreas Schjønhaug
 */

import * as functions from "firebase-functions"
import exportToDoc from "./exportToDoc"
import statistics from "./statistics"
import transcription from "./transcription"

// -------------
// Transcription
// -------------

exports.transcription = functions
  .region("europe-west1")
  .firestore.document("transcripts/{transcriptId}")
  .onCreate(transcription)

// -------------
// Export to doc
// -------------

exports.exportToDoc = functions.region("europe-west1").https.onRequest(exportToDoc)

// ----------
// Statistics
// ----------

exports.statistics = functions
  .region("europe-west1")
  .pubsub.topic("transcriptFinished")
  .onPublish(statistics)

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`))
})
