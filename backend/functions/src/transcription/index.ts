import database from "../database"
import { Step } from "../enums"
import { ITranscript } from "../interfaces"
import { saveResult } from "./persistence"
import { transcode } from "./transcoding"
import { transcribe } from "./transcribe"

async function transcription(documentSnapshot: FirebaseFirestore.DocumentSnapshot, eventContext) {
  try {
    console.log(`Deployed 15:53 - Start transcription of id: ${documentSnapshot.id}`)

    const transcriptId = documentSnapshot.id

    // Because of indempotency, we need to fetch the transcript from the server and check if it's already in process
    const step = await database.getStep(transcriptId)
    if (step !== Step.Uploading) {
      console.warn("Transcript already processed, returning")
      return
    }

    const transcript = documentSnapshot.data() as ITranscript

    if (transcript === undefined || transcript.userId === undefined) {
      throw Error("Transcript or user id missing")
    }

    // 1. Transcode

    await database.setStep(transcriptId, Step.Transcoding)
    const uri = await transcode(transcriptId, transcript.userId)

    // 2. Transcribe

    await database.setStep(transcriptId, Step.Transcribing)
    const speechRecognitionResults = await transcribe(transcriptId, transcript, uri)

    // 3. Save transcription

    await database.setStep(transcriptId, Step.Saving)
    await saveResult(speechRecognitionResults, transcriptId)

    // 4. Done

    await database.setStep(transcriptId, Step.Done)
    console.log("End transcribing of id: ", transcriptId)
  } catch (error) {
    console.log("Error in main function")
    console.error(error)

    await database.errorOccured(documentSnapshot.id, error)

    throw error
  }
}

export default transcription
