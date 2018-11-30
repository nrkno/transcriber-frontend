import admin from "firebase-admin"
import * as functions from "firebase-functions"
import ua, { EventParams } from "universal-analytics"
import database from "../database"

async function statistics(message: functions.pubsub.Message, context: functions.EventContext) {
  const visitor = ua("")
  visitor.debug(true)

  try {
    const transcriptId = message.json.transcriptId

    // Load results and calculate number of words

    const results = await database.getResults(transcriptId)

    const numberOfWords = results.reduce((accumulator, result) => accumulator + result.words.length, 0)

    // Load transcript, and check that all mandatory values are present

    const transcript = await database.getTranscript(transcriptId)

    const metadata = transcript.metadata

    if (metadata === undefined) {
      throw new Error(`Metadata missing from transcript ${transcriptId}`)
    }
    const audioDuration = Math.round(metadata.audioDuration!)
    const languageCodes = metadata.languageCodes

    if (transcript.timestamps === undefined) {
      throw new Error(`Timestamps missing from transcript ${transcriptId}`)
    } else if (audioDuration === undefined) {
      throw new Error(`Duration missing from transcript ${transcriptId}`)
    } else if (languageCodes === undefined) {
      throw new Error(`Language codes missing from transcript ${transcriptId}`)
    } else if (transcript.metadata === undefined || transcript.metadata.originalMimeType === undefined) {
      throw new Error(`Original mime type missing from transcript ${transcriptId}`)
    }

    const createdAt = (transcript.timestamps.createdAt as admin.firestore.Timestamp).toMillis() / 1000
    const transcodedAt = (transcript.timestamps.transcodedAt as admin.firestore.Timestamp).toMillis() / 1000
    const transcribedAt = (transcript.timestamps.transcribedAt as admin.firestore.Timestamp).toMillis() / 1000
    const savedAt = (transcript.timestamps.savedAt as admin.firestore.Timestamp).toMillis() / 1000

    // Calculating the different process step durations

    const transcodingDuration = Math.round(transcodedAt - createdAt)
    const transcribingDuration = Math.round(transcribedAt - transcodedAt)
    const savingDuration = Math.round(savedAt - transcribedAt)

    const eventParams: EventParams = {
      // Custom dimensions
      cd1: languageCodes.join(","),
      cd2: transcript.metadata.originalMimeType,
      // Custom metrics
      cm1: audioDuration,
      cm2: numberOfWords,
      cm3: transcodingDuration,
      cm4: transcribingDuration,
      cm5: savingDuration,
      // Category and action
      ea: "done",
      ec: "transcription",
    }

    console.log("Sending to GA", eventParams)

    visitor.event(eventParams).send()

    console.log(transcriptId)
  } catch (error) {
    console.error(error)
  }
}

export default statistics
