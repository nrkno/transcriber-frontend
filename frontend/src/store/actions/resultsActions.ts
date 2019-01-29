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

export const writeWord = (resultIndex: number, wordIndex: number, text: string, isEditedByUser: boolean) => (dispatch: Dispatch, getState) => {
  console.log("WRITE WORD action")

  dispatch({
    isEditedByUser,
    resultIndex,
    text,
    type: "WRITE_WORD",
    wordIndex,
  })
}
