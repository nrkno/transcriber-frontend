import { Dispatch } from "redux"
import { ITranscript } from "../../interfaces"

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
