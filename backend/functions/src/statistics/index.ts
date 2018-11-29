import admin from "firebase-admin"
import * as functions from "firebase-functions"
import ua, { EventParams } from "universal-analytics"
import database from "../database"
import { ITranscriptSummary } from "../interfaces"

async function statistics(message: functions.pubsub.Message, context: functions.EventContext) {
  const visitor = ua("")
  visitor.debug(true)

  try {
    const transcriptId = message.json.transcriptId

    // Load results and calculate number of words

    const results = await database.getResults(transcriptId)

    const words = results.reduce((accumulator, result) => accumulator + result.words.length, 0)

    // Load transcript, and check that all mandatory values are present

    const transcript = await database.getTranscript(transcriptId)

    const metadata = transcript.metadata

    if (metadata === undefined) {
      throw new Error(`Metadata missing from transcript ${transcriptId}`)
    }
    const audioDuration = metadata.audioDuration
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

    const start = transcript.timestamps.createdAt as admin.firestore.Timestamp
    const end = transcript.timestamps.savedAt as admin.firestore.Timestamp

    const processingDuration = (end.toMillis() - start.toMillis()) / 1000

    /*const transcriptSummary: ITranscriptSummary = {
      createdAt: admin.firestore.Timestamp.now(),
      audioDuration,
      languageCodes,
      mimeType: transcript.metadata.originalMimeType,
      processingDuration,
      words,
    }*/

    const eventParams: EventParams = {
      cd1: audioDuration,
      cd2: languageCodes.join(","),
      cd3: transcript.metadata.originalMimeType,
      cd4: processingDuration,
      cd5: words,
      ea: "done",
      ec: "transcription",
    }

    console.log("Sending to GA", eventParams)

    visitor.event(eventParams).send()

    // await database.addTranscriptSummary(transcriptSummary)

    console.log(transcriptId)
  } catch (error) {
    console.error(error)
  }
}

export default statistics
