import admin from "firebase-admin"
import * as functions from "firebase-functions"
import database from "../database"
import { ITranscriptSummary } from "../interfaces"

async function statistics(message: functions.pubsub.Message, context: functions.EventContext) {
  try {
    const transcriptId = message.json.transcriptId

    // Load results and calculate number of words

    const results = await database.getResults(transcriptId)

    const words = results.reduce((accumulator, result) => accumulator + result.words.length, 0)

    // Load transcript, and check that all mandatory values are present

    const transcript = await database.getTranscript(transcriptId)

    const duration = transcript.duration
    const languageCodes = transcript.languageCodes

    if (transcript.timestamps === undefined) {
      throw new Error(`Timestamps missing from transcript ${transcriptId}`)
    } else if (duration === undefined) {
      throw new Error(`Duration missing from transcript ${transcriptId}`)
    } else if (languageCodes === undefined) {
      throw new Error(`Language codes missing from transcript ${transcriptId}`)
    } else if (transcript.recognitionMetadata === undefined || transcript.recognitionMetadata.originalMimeType === undefined) {
      throw new Error(`Original mime type missing from transcript ${transcriptId}`)
    }

    const start = transcript.timestamps.createdAt as admin.firestore.Timestamp
    const end = transcript.timestamps.savedAt as admin.firestore.Timestamp

    const processingDuration = (end.toMillis() - start.toMillis()) / 1000

    const transcriptSummary: ITranscriptSummary = {
      createdAt: admin.firestore.Timestamp.now(),
      duration,
      languageCodes,
      mimeType: transcript.recognitionMetadata.originalMimeType,
      processingDuration,
      words,
    }

    await database.addTranscriptSummary(transcriptSummary)

    // For all metrics, we log
    // * All time
    // * Yearly
    // * Monthly
    // * Weekly?
    // * Daily

    // Number of transcripts

    // statistics/numberOfTranscript ++
    // statistics/2017

    // Original mime type

    // Duration

    // Language codes

    // Completion time

    // Word count

    // 100 ord / 1000 sec = 0.1 ord/sec

    console.log(transcriptId)
  } catch (error) {
    console.error(error)
  }
}

export default statistics
