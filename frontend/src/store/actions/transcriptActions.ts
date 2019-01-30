import ReactGA from "react-ga"
import { Dispatch } from "redux"
import { ITranscript } from "../../interfaces"

////////////
// CREATE //
////////////

export const createTranscript = (transcriptId: string, transcript: ITranscript) => async (dispatch: Dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore()

  try {
    await firestore.doc(`transcripts/${transcriptId}`).set(transcript)

    dispatch({
      type: "TRANSCRIPT_CREATED",
    })
  } catch (error) {
    ReactGA.exception({
      description: error.message,
      fatal: false,
    })
  }
}

//////////
// READ //
//////////

export const readResults = (transcriptId: string) => async (dispatch: Dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore()

  try {
    const querySnapshot = await firestore.get({ collection: `transcripts/${transcriptId}/results`, orderBy: "startTime" })

    const results = new Array()

    querySnapshot.docs.forEach(doc => {
      const result = doc.data()
      const id = doc.id
      results.push({ id, ...result })
    })

    console.log("results", results)

    dispatch({
      results,
      type: "READ_RESULTS",
    })
  } catch (error) {
    console.error(error)
    ReactGA.exception({
      description: error.message,
      fatal: false,
    })
  }
}

////////////
// UPDATE //
////////////

export const updateWords = (resultIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) => (dispatch: Dispatch, getState) => {
  console.log("Dispatch UPDATE WORDS action", resultIndex, wordIndexStart, wordIndexEnd, words, recalculate)

  dispatch({
    recalculate,
    resultIndex,
    type: "UPDATE_WORDS",
    wordIndexEnd,
    wordIndexStart,
    words,
  })
}

//////////
// OTHER//
//////////

export const splitResults = (resultIndex: number, wordIndex: number) => (dispatch: Dispatch) => {
  console.log("SPLIT_RESULTS action", resultIndex, wordIndex)

  dispatch({
    resultIndex,
    type: "SPLIT_RESULTS",
    wordIndex,
  })
}

export const selectTranscript = (transcriptId: string, transcript: ITranscript) => (dispatch: Dispatch) => {
  console.log("SELECT_TRANSCRIPT action", transcript)

  dispatch({
    transcript,
    transcriptId,
    type: "SELECT_TRANSCRIPT",
  })
}
