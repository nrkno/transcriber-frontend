import ReactGA from "react-ga"
import { Dispatch } from "redux"

export const readResults = (transcriptId: string) => async (dispatch: Dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore()

  try {
    const querySnapshot = await firestore.get({ collection: `transcripts/${transcriptId}/results`, orderBy: "startTime" })

    console.log(querySnapshot)
    console.log(querySnapshot.docs)

    const results = new Array()

    querySnapshot.docs.forEach(doc => {
      console.log("doc", doc)

      const result = doc.data()

      console.log("id", doc.id)

      console.log("result", result)

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
