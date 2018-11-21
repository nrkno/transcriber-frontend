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
    return db.doc(`transcripts/${id}`).set({ ...transcript }, { merge: true })
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
    // We insert the start time of the first word, it will be used to sort the results

    const startTime = parseInt(result.words[0].startTime.seconds, 10) || 0

    const resultWithStartTimeInSeconds = { ...result, startTime }

    const data = JSON.parse(JSON.stringify(resultWithStartTimeInSeconds))

    return db.collection(`transcripts/${id}/results`).add(data)
  }

  const setDuration = async (id: string, seconds: number) => {
    const transcript: ITranscript = { duration: seconds }

    return updateTranscript(id, transcript)
  }

  const errorOccured = async (id: string, error: Error) => {
    const transcript: ITranscript = {
      error: serializeError(error),
      progress: {
        status: Status.Failed,
      },
    }
    return updateTranscript(id, transcript)
  }

  const getResults = async (id: string): Promise<IResult[]> => {
    const querySnapshot = await db
      .collection(`transcripts/${id}/results`)
      .orderBy("startTime")
      .get()

    const results = Array<IResult>()

    querySnapshot.forEach(doc => {
      const result = doc.data() as IResult

      results.push(result)
    })

    return results
  }

  const getStatus = async (id: string) => {
    const doc = await db.doc(`transcripts/${id}`).get()

    const transcript = doc.data() as ITranscript

    return transcript.progress.status
  }

  return { addResult, errorOccured, setDuration, setStatus, setPercent, getStatus, getResults }
})()

export default database
