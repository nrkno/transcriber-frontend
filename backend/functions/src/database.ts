/**
 * @file Sets up Firebase
 * @author Andreas Schjønhaug
 */

import admin from "firebase-admin"
import * as functions from "firebase-functions"
import { Status } from "./enums"
import serializeError from "serialize-error"

// Only initialise the app once
if (!admin.apps.length) {
  admin.initializeApp(functions.config().firebase)
} else {
  admin.app()
}
const realtimeDatabase = admin.database()

const database = (() => {
  const updateTranscript = async (id: string, transcription: object) => {
    return realtimeDatabase.ref(`/transcripts/${id}`).update({ ...transcription })
  }

  const updateStatus = async (id: string, status: Status) => {
    const transcription: any = { "progress/status": status, [`timestamps/${status}`]: admin.database.ServerValue.TIMESTAMP }

    // We get completion percentages when transcribing and saving, so setting them to zero.
    if (status === Status.Transcribing || status === Status.Saving) {
      transcription["progress/percent"] = 0
    } else {
      transcription["progress/percent"] = null
    }

    return updateTranscript(id, transcription)
  }

  const updatePercent = async (id: string, percent: number) => {
    const transcription: any = { "progress/percent": percent }

    return updateTranscript(id, transcription)
  }

  const addWords = async (id: string, words: any) => {
    return realtimeDatabase.ref(`/transcripts/${id}/text`).push(JSON.parse(JSON.stringify(words)))
  }

  const setDurationInSeconds = async (id: string, seconds: number) => {
    const transcription = { "audioFile/durationInSeconds": seconds }

    return updateTranscript(id, transcription)
  }

  const errorOccured = async (id: string, error: Error) => {
    const data = {
      error: serializeError(error),
      progress: {
        percent: null,
        status: "failed",
      },
    }
    return updateTranscript(id, data)
  }

  return { addWords, errorOccured, setDurationInSeconds, updateStatus, updatePercent }
})()

export default database
