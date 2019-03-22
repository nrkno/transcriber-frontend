import { createAction } from "typesafe-actions"
import { IParagraph, ITranscript } from "../../interfaces"
import { DELETE_WORDS, JOIN_RESULTS, READ_RESULTS, SELECT_TRANSCRIPT, SPLIT_RESULTS, UPDATE_SPEAKER, UPDATE_SPEAKER_NAME, UPDATE_START_TIME, UPDATE_WORDS } from "../constants"

//////////
// READ //
//////////
export const readResults = createAction(READ_RESULTS, action => {
  return (results: IParagraph[]) => action({ results })
})

////////////
// UPDATE //
////////////

export const updateWords = createAction(UPDATE_WORDS, action => {
  return (resultIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) => action({ recalculate, resultIndex, wordIndexEnd, wordIndexStart, words })
})

export const updateSpeaker = createAction(UPDATE_SPEAKER, action => {
  return (resultIndex: number, speaker: number) => action({ resultIndex, speaker })
})

export const updateSpeakerName = createAction(UPDATE_SPEAKER_NAME, action => {
  return (speaker: number, name: string, resultIndex?: number) => action({ name, resultIndex, speaker })
})

export const updateStartTime = createAction(UPDATE_START_TIME, action => {
  return (startTime: number) => action({ startTime })
})

//////////
// DELETE//
//////////

export const deleteWords = createAction(DELETE_WORDS, action => {
  return (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => action({ name, resultIndex, wordIndexEnd, wordIndexStart })
})

//////////
// OTHER//
//////////

export const joinResults = createAction(JOIN_RESULTS, action => {
  return (resultIndex: number, wordIndex: number) =>
    action({
      resultIndex,
      wordIndex,
    })
})

export const splitResults = createAction(SPLIT_RESULTS, action => {
  return (resultIndex: number, wordIndex: number) =>
    action({
      resultIndex,
      wordIndex,
    })
})

export const selectTranscript = createAction(SELECT_TRANSCRIPT, action => {
  return (transcriptId: string, transcript: ITranscript) =>
    action({
      transcript,
      transcriptId,
    })
})
