import * as functions from "firebase-functions"
import path from "path"
import ua from "universal-analytics"
import database from "../database"
import { bucket } from "../transcription/storage"

async function deleteTranscript(data: any, context: functions.https.CallableContext) {
  // ----------------
  // Google analytics
  // ----------------

  const accountId = functions.config().analytics.account_id

  if (!accountId) {
    console.warn("Google Analytics account ID missing")
  }

  const visitor = ua(accountId)

  try {
    // Check that transcript id is present

    const transcriptId = data.transcriptId

    if (!transcriptId) {
      throw new Error("Transcript id missing")
    }

    const transcript = await database.getTranscript(transcriptId)

    // Setting user id
    visitor.set("uid", transcript.userId)

    // Authentication / user information is automatically added to the request

    if (!context.auth) {
      throw new Error("Authentication missing")
    }

    const userId = context.auth.uid

    // Check that the user owns the transcript

    if (transcript.userId !== userId) {
      throw new Error("User does not own the transcript")
    }

    // Step 1: Delete the transcript from database

    await database.deleteTranscript(transcriptId)

    // Step 2: Delete the media files

    const prefix = path.join(path.join("media", userId), transcriptId)

    // Prefix will be /media/userId/transcriptId
    // Using this as a prefix, we will be able to delete
    // Prefix will be /media/userId/transcriptId-original
    // Prefix will be /media/userId/transcriptId-playback.m4a
    // Prefix will be /media/userId/transcriptId-transcribed.flac

    await bucket.deleteFiles({ prefix })

    if (transcript.process && transcript.process.step) {
      visitor.event("transcription", "deleted", transcript.process.step).send()
    }

    return { success: true }
  } catch (error) {
    // Log error to console
    console.error(error)

    // Log error to Google Analytics
    visitor.exception(error.message, true).send()

    return { success: false }
  }
}

export default deleteTranscript
