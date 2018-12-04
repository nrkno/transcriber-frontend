import * as functions from "firebase-functions"
import ua from "universal-analytics"
import database from "../database"
import { Step } from "../enums"
import { ITranscript } from "../interfaces"
import { saveResult } from "./persistence"
import { transcode } from "./transcoding"
import { transcribe } from "./transcribe"

async function transcription(documentSnapshot: FirebaseFirestore.DocumentSnapshot /*, eventContext*/) {
  console.log(`Deployed 15:53 - Start transcription of id: ${documentSnapshot.id}`)

  // ----------------
  // Google analytics
  // ----------------

  const accountId = functions.config().analytics.account_id

  if (!accountId) {
    console.warn("Google Analytics account ID missing")
  }

  const visitor = ua(accountId)

  try {
    const startDate = Date.now()

    const transcriptId = documentSnapshot.id

    // Because of indempotency, we need to fetch the transcript from
    // the server and check if it's already in process
    const step = await database.getStep(transcriptId)
    if (step !== Step.Uploading) {
      console.warn("Transcript already processed, returning")
      return
    }

    // Check for mandatory fields

    const transcript = documentSnapshot.data() as ITranscript

    if (transcript === undefined) {
      throw Error("Transcript missing")
    } else if (transcript.userId === undefined) {
      throw Error("User id missing")
    } else if (transcript.metadata === undefined) {
      throw Error("Metadata missing")
    } else if (transcript.metadata.languageCodes === undefined) {
      throw Error("Language codes missing")
    } else if (transcript.metadata.originalMimeType === undefined) {
      throw Error("Original mime type missing")
    }

    // Setting user id

    visitor.set("uid", transcript.userId)

    // Setting custom dimensions

    visitor.set("cd1", transcript.metadata.languageCodes.join(","))
    visitor.set("cd2", transcript.metadata.originalMimeType)

    if (transcript.metadata.industryNaicsCodeOfAudio) {
      visitor.set("cd3", transcript.metadata.industryNaicsCodeOfAudio)
    }

    if (transcript.metadata.interactionType) {
      visitor.set("cd4", transcript.metadata.interactionType)
    }

    if (transcript.metadata.microphoneDistance) {
      visitor.set("cd5", transcript.metadata.microphoneDistance)
    }

    if (transcript.metadata.originalMediaType) {
      visitor.set("cd6", transcript.metadata.originalMediaType)
    }

    if (transcript.metadata.recordingDeviceName) {
      visitor.set("cd7", transcript.metadata.recordingDeviceName)
    }

    if (transcript.metadata.recordingDeviceType) {
      visitor.set("cd8", transcript.metadata.recordingDeviceType)
    }

    // Setting custom metrics

    visitor.set("cm1", transcript.metadata.audioTopic ? transcript.metadata.audioTopic.split(" ").length : 0)
    visitor.set("cm2", transcript.metadata.speechContexts ? transcript.metadata.speechContexts[0].phrases.length : 0)

    // -----------------
    // Step 1: Transcode
    // -----------------

    await database.setStep(transcriptId, Step.Transcoding)
    const { audioDuration, gsUri } = await transcode(transcriptId, transcript.userId)
    visitor.set("cm3", Math.round(audioDuration))

    const transcodedDate = Date.now()
    const transcodedDuration = transcodedDate - startDate

    visitor.set("cm5", Math.round(transcodedDuration / 1000))
    visitor.event("transcription", "transcoded", transcriptId).send()
    visitor.timing("transcription", "transcoding", Math.round(transcodedDuration), transcriptId).send()

    console.log("transcodedDuration", transcodedDuration)

    // ------------------
    // Step 2: Transcribe
    // ------------------

    await database.setStep(transcriptId, Step.Transcribing)
    const speechRecognitionResults = await transcribe(transcriptId, transcript, gsUri)

    console.log("speechRecognitionResults", speechRecognitionResults)

    const numberOfWords = speechRecognitionResults.reduce((accumulator, result) => accumulator + result.alternatives[0].transcript.split(" ").length, 0)
    console.log("Number of words", numberOfWords)

    visitor.set("cm4", numberOfWords)

    const transcribedDate = Date.now()
    const transcribedDuration = transcribedDate - transcodedDate

    visitor.set("cm6", Math.round(transcribedDuration / 1000))
    visitor.event("transcription", "transcribed", transcriptId).send()
    visitor.timing("transcription", "transcribing", Math.round(transcribedDuration), transcriptId).send()

    console.log("transcribedDuration", transcribedDuration)

    // ------------
    // Step 3: Save
    // ------------

    await database.setStep(transcriptId, Step.Saving)
    await saveResult(speechRecognitionResults, transcriptId)

    const savedDate = Date.now()
    const savedDuration = savedDate - transcribedDate

    console.log("savedDuration", savedDuration)

    visitor.set("cm7", Math.round(savedDuration / 1000))
    visitor.event("transcription", "saved", transcriptId).send()
    visitor.timing("transcription", "saving", Math.round(savedDuration), transcriptId).send()

    const processDuration = savedDate - startDate
    visitor.set("cm8", Math.round(processDuration / 1000))

    visitor.event("transcription", "done", transcriptId, Math.round(audioDuration)).send()

    // Done

    await database.setStep(transcriptId, Step.Done)
  } catch (error) {
    // Log error to console

    console.error(error)

    // Log error to Google Analytics

    visitor.exception(error.message, true).send()

    // Log error to database

    await database.errorOccured(documentSnapshot.id, error)

    throw error
  }
}

export default transcription
