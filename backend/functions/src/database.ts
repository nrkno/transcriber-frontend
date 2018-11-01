/**
 * @file Sets up Firebase
 * @author Andreas Schjønhaug
 */

import admin from "firebase-admin"
import * as functions from "firebase-functions"
import serializeError from "serialize-error"
import { Status } from "./enums"
import { IResult, ITranscript } from "./interfaces"
// Only initialise the app once
if (!admin.apps.length) {
  admin.initializeApp(functions.config().firebase)
} else {
  admin.app()
}

const db = admin.firestore()
const settings = { timestampsInSnapshots: true }
db.settings(settings)

const database = (() => {
  const updateTranscript = async (id: string, transcript: ITranscript) => {
    console.log("Updating status")
    console.log(transcript)

    return db.doc(`users/aaaa/transcripts/${id}`).set({ ...transcript }, { merge: true })
  }

  const setStatus = async (id: string, status: Status) => {
    const transcript: ITranscript = { progress: { status }, timestamps: { [`${status}`]: admin.firestore.Timestamp.now() } }

    // We get completion percentages when transcribing and saving, so setting them to zero.
    if (status === Status.Transcribing || status === Status.Saving) {
      transcript.progress!.percent = 0
    } else {
      transcript.progress!.percent = admin.firestore.FieldValue.delete()
    }

    return updateTranscript(id, transcript)
  }

  const setPercent = async (id: string, percent: number) => {
    const transcript: ITranscript = { progress: { percent } }

    return updateTranscript(id, transcript)
  }

  const addResult = async (id: string, result: IResult) => {
    return db.collection(`users/aaaa/transcripts/${id}/results`).add(result.toJSON())
  }

  const setDurationInSeconds = async (id: string, seconds: number) => {
    const transcript: ITranscript = { durationInSeconds: seconds }

    return updateTranscript(id, transcript)
  }

  const errorOccured = async (id: string, error: Error) => {
    const transcript: ITranscript = {
      error: serializeError(error),
      progress: {
        percent: undefined,
        status: Status.Failed,
      },
    }
    return updateTranscript(id, transcript)
  }

  const getStatus = async (id: string) => {
    const doc = await db.doc(`users/aaaa/transcripts/${id}`).get()

    const transcript = doc.data() as ITranscript

    return transcript.progress.status
  }

  return { addResult, errorOccured, setDurationInSeconds, setStatus, setPercent, getStatus }
})()

export default database
