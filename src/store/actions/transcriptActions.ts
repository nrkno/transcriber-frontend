import { createAction } from "typesafe-actions"
import { IParagraph, ITranscript } from "../../interfaces"
import { DELETE_WORDS, JOIN_PARAGRAPHS, READ_PARAGRAPHS, SELECT_TRANSCRIPT, SPLIT_PARAGRAPHS, UPDATE_SPEAKER, UPDATE_SPEAKER_NAME, UPDATE_START_TIME, UPDATE_WORDS } from "../constants"

//////////
// READ //
//////////
export const readParagraphs = createAction(READ_PARAGRAPHS, action => {
  return (paragraphs: IParagraph[]) => action({ paragraphs })
})

////////////
// UPDATE //
////////////

export const updateWords = createAction(UPDATE_WORDS, action => {
  return (paragraphIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) => action({ recalculate, paragraphIndex, wordIndexEnd, wordIndexStart, words })
})

export const updateSpeaker = createAction(UPDATE_SPEAKER, action => {
  return (paragraphIndex: number, speaker: number) => action({ paragraphIndex, speaker })
})

export const updateSpeakerName = createAction(UPDATE_SPEAKER_NAME, action => {
  return (speaker: number, name: string, paragraphIndex?: number) => action({ name, paragraphIndex, speaker })
})

export const updateStartTime = createAction(UPDATE_START_TIME, action => {
  return (startTime: number) => action({ startTime })
})

//////////
// DELETE//
//////////

export const deleteWords = createAction(DELETE_WORDS, action => {
  return (paragraphIndex: number, wordIndexStart: number, wordIndexEnd: number) => action({ name, paragraphIndex, wordIndexEnd, wordIndexStart })
})

//////////
// OTHER//
//////////

export const joinParagraphs = createAction(JOIN_PARAGRAPHS, action => {
  return (paragraphIndex: number, wordIndex: number) =>
    action({
      paragraphIndex,
      wordIndex,
    })
})

export const splitParagraphs = createAction(SPLIT_PARAGRAPHS, action => {
  return (paragraphIndex: number, wordIndex: number) =>
    action({
      paragraphIndex,
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
