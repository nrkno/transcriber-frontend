import database from "../database"
import { Status } from "../enums"
import { ITranscript } from "../interfaces"
import { saveResult } from "./persistence"
import { transcode } from "./transcoding"
import { transcribe } from "./transcribe"

async function transcription(documentSnapshot: FirebaseFirestore.DocumentSnapshot, eventContext) {
  try {
    console.log(`Deployed 15:53 - Start transcription of id: ${documentSnapshot.id}`)

    const transcriptId = documentSnapshot.id

    // Because of indempotency, we need to fetch the transcript from the server and check if it's already in process
    const status = await database.getStatus(transcriptId)
    if (status !== Status.Uploading) {
      console.warn("Transcript already processed, returning")
      return
    }

    const transcript = documentSnapshot.data() as ITranscript

    if (transcript === undefined || transcript.userId === undefined) {
      throw Error("Transcript or user id missing")
    }

    // 1. Transcode

    await database.setStatus(transcriptId, Status.Transcoding)
    const uri = await transcode(transcriptId, transcript.userId)

    // 2. Transcribe

    await database.setStatus(transcriptId, Status.Transcribing)
    const speechRecognitionResults = await transcribe(transcriptId, transcript, uri)

    // 3. Save transcription

    await database.setStatus(transcriptId, Status.Saving)
    await saveResult(speechRecognitionResults, transcriptId)

    // 4. Done

    await database.setStatus(transcriptId, Status.Success)
    console.log("End transcribing with id: ", transcriptId)
  } catch (error) {
    console.log("Error in main function")
    console.error(error)

    await database.errorOccured(documentSnapshot.id, error)

    throw error
  }
}

export default transcription
