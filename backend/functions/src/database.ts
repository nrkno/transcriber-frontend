/**
 * @file Sets up Firebase
 * @author Andreas Schjønhaug
 */

import { WriteResult } from "@google-cloud/firestore"
import admin from "firebase-admin"
import * as functions from "firebase-functions"
import serializeError from "serialize-error"
import { Step } from "./enums"
import { IResult, ITranscript } from "./interfaces"
// Only initialise the app once
if (!admin.apps.length) {
  admin.initializeApp(functions.config().firebase)
} else {
  admin.app()
}

const db = admin.firestore()

const database = (() => {
  const updateTranscript = async (id: string, transcript: ITranscript): Promise<FirebaseFirestore.WriteResult> => {
    return db.doc(`transcripts/${id}`).set({ ...transcript }, { merge: true })
  }

  const setStep = async (transcriptId: string, step: Step): Promise<FirebaseFirestore.WriteResult> => {
    const transcript: ITranscript = { process: { step } }

    if (step === Step.Transcoding || step === Step.Saving) {
      transcript.process!.percent = 0
    } else if (step === Step.Done) {
      transcript.process.percent = admin.firestore.FieldValue.delete()
    }

    return updateTranscript(transcriptId, transcript)
  }

  const setPercent = async (transcriptId: string, percent: number): Promise<FirebaseFirestore.WriteResult> => {
    const transcript: ITranscript = { process: { percent } }

    return updateTranscript(transcriptId, transcript)
  }

  const addResult = async (transcriptId: string, result: IResult) => {
    return db.collection(`transcripts/${transcriptId}/results`).add(result)
  }

  const setDuration = async (transcriptId: string, seconds: number): Promise<FirebaseFirestore.WriteResult> => {
    const transcript: ITranscript = { metadata: { audioDuration: seconds } }

    return updateTranscript(transcriptId, transcript)
  }

  const errorOccured = async (transcriptId: string, error: Error): Promise<FirebaseFirestore.WriteResult> => {
    const serializedError = serializeError(error)

    // Firestore does not support undefined values, remove them if present.
    Object.keys(serializedError).forEach(key => serializedError[key] === undefined && delete serializedError[key])

    const transcript: ITranscript = {
      process: {
        error: serializedError,
      },
    }
    return updateTranscript(transcriptId, transcript)
  }

  const getResults = async (transcriptId: string): Promise<IResult[]> => {
    const querySnapshot = await db
      .collection(`transcripts/${transcriptId}/results`)
      .orderBy("startTime")
      .get()

    const results = Array<IResult>()

    querySnapshot.forEach(doc => {
      const result = doc.data() as IResult

      results.push(result)
    })

    return results
  }

  const getStep = async (id: string): Promise<Step> => {
    const doc = await db.doc(`transcripts/${id}`).get()

    const transcript = doc.data() as ITranscript

    return transcript.process.step
  }

  const setPlaybackGsUrl = async (id: string, url: string) => {
    const transcript: ITranscript = { playbackGsUrl: url }

    return updateTranscript(id, transcript)
  }

  const getTranscript = async (transcriptId: string): Promise<ITranscript> => {
    const doc = await db.doc(`transcripts/${transcriptId}`).get()

    return doc.data() as ITranscript
  }

  const deleteTranscript = async (transcriptId: string): Promise<WriteResult> => {
    // Delete the results collection
    const resultsPath = `/transcripts/${transcriptId}/results`

    await deleteCollection(resultsPath, 10)

    // Delete the document
    return db.doc(`transcripts/${transcriptId}`).delete()
  }

  const deleteCollection = async (collectionPath: string, batchSize: number): Promise<{}> => {
    const collectionRef = db.collection(collectionPath)
    const query = collectionRef.orderBy("__name__").limit(batchSize)

    return new Promise((resolve, reject) => {
      deleteQueryBatch(query, batchSize, resolve, reject)
    })
  }

  const deleteQueryBatch = (query: FirebaseFirestore.Query, batchSize: number, resolve, reject) => {
    query
      .get()
      .then(snapshot => {
        // When there are no documents left, we are done
        if (snapshot.size === 0) {
          return 0
        }

        // Delete documents in a batch
        const batch = db.batch()
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref)
        })

        return batch.commit().then(() => {
          return snapshot.size
        })
      })
      .then((numDeleted: number) => {
        if (numDeleted === 0) {
          resolve()
          return
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          deleteQueryBatch(query, batchSize, resolve, reject)
        })
      })
      .catch(reject)
  }

  return { addResult, deleteTranscript, errorOccured, setDuration, setStep, setPercent, getStep, getResults, setPlaybackGsUrl, getTranscript }
})()

export default database
