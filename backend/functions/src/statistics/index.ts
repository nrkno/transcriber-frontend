import * as functions from "firebase-functions"
import database from "../database"

async function statistics(message: functions.pubsub.Message, context: functions.EventContext) {
  try {
    const transcriptId = message.json.transcriptId

    // Load transcript

    const transcript = await database.getTranscript(transcriptId)

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

    console.log(transcriptId)
  } catch (error) {
    console.error(error)
  }
}

export default statistics
