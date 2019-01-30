import ReactGA from "react-ga"
import { Dispatch } from "redux"

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
      payload: results,
      type: "RESULT_READ",
    })
  } catch (error) {
    console.error(error)
    ReactGA.exception({
      description: error.message,
      fatal: false,
    })
  }
}

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
