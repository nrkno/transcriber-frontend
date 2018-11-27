import admin from "firebase-admin"
import * as functions from "firebase-functions"
import database from "../database"
import { ITranscriptSummary } from "../interfaces"

async function statistics(message: functions.pubsub.Message, context: functions.EventContext) {
  try {
    const transcriptId = message.json.transcriptId

    // Load transcript

    const transcript = await database.getTranscript(transcriptId)

    console.log(transcript)

    // Create a new statistic

    // Calculate processing duration

    if (!transcript.timestamps) {
      return
    }

    const start = transcript.timestamps.createdAt as admin.firestore.Timestamp
    const end = transcript.timestamps.savedAt as admin.firestore.Timestamp

    console.log(start, end)
    console.log(start.toMillis(), end.toMillis())

    const processingDuration = (end.toMillis() - start.toMillis()) / 1000

    const transcriptSummary: ITranscriptSummary = {
      createdAt: admin.firestore.Timestamp.now(),
      duration: transcript.duration,
      languageCodes: transcript.languageCodes,
      mimeType: transcript.recognitionMetadata.originalMimeType,
      paragraphs: 5,
      processingDuration,
      words: 100,
    }

    console.log(transcriptSummary)

    await database.addTranscriptSummary(transcriptSummary)

    /*
paragraphs?: number
processingDuration?: number
words?: number*/
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
