import update from "immutability-helper"
import { ActionType } from "typesafe-actions"
import { database } from "../../firebaseApp"
import { IParagraph, ITranscript, IWord } from "../../interfaces"
import * as transcriptActions from "../actions/transcriptActions"
import { DELETE_WORDS, JOIN_PARAGRAPHS, READ_PARAGRAPHS, SELECT_TRANSCRIPT, SPLIT_PARAGRAPHS, UPDATE_FRAMES_PER_SECOND, UPDATE_SPEAKER, UPDATE_SPEAKER_NAME, UPDATE_START_TIME, UPDATE_WORDS } from "../constants"

export type TranscriptAction = ActionType<typeof transcriptActions>

export default (state: ITranscript = {}, action: TranscriptAction) => {
  switch (action.type) {
    //////////
    // READ //
    //////////

    case READ_PARAGRAPHS:
      return readParagraphs(state, action.payload.paragraphs)
    case SELECT_TRANSCRIPT:
      return selectTranscript(action.payload.transcriptId, action.payload.transcript)

    ////////////
    // UPDATE //
    ////////////

    case UPDATE_SPEAKER:
      return updateSpeaker(state, action.payload.paragraphIndex, action.payload.speaker)

    case UPDATE_SPEAKER_NAME:
      return updateSpeakerName(state, action.payload.speaker, action.payload.name, action.payload.paragraphIndex)

    case UPDATE_START_TIME:
      return updateStartTime(state, action.payload.startTime)

    case UPDATE_FRAMES_PER_SECOND:
      return updateFramesPerSecond(state, action.payload.framesPerSecond)

    case UPDATE_WORDS:
      return updateWords(state, action.payload.paragraphIndex, action.payload.wordIndexStart, action.payload.wordIndexEnd, action.payload.words, action.payload.recalculate)

    case SPLIT_PARAGRAPHS:
      return splitParagraph(state, action.payload.paragraphIndex, action.payload.wordIndex)

    case JOIN_PARAGRAPHS:
      return joinParagraphs(state, action.payload.paragraphIndex, action.payload.wordIndex)

    ////////////
    // DELETE //
    ////////////

    case DELETE_WORDS:
      return deleteWords(state, action.payload.paragraphIndex, action.payload.wordIndexStart, action.payload.wordIndexEnd)

    default:
      return state
  }
}

function readParagraphs(state: ITranscript, paragraphs: IParagraph[]) {
  return {
    ...state,
    paragraphs,
  }
}

function selectTranscript(transcriptId: string, transcript: ITranscript) {
  return {
    id: transcriptId,
    ...transcript,
  }
}

function deleteWords(state: ITranscript, paragraphIndex: number, wordIndexStart: number, wordIndexEnd: number) {
  const newWords = Array<IWord>()

  for (let i = wordIndexStart; i <= wordIndexEnd; i++) {
    const word = state.paragraphs[paragraphIndex].words[i]

    newWords.push({
      ...word,
      deleted: true,
    })
  }

  // Replace array of words in correct position

  const paragraphs = update(state.paragraphs, {
    [paragraphIndex]: {
      words: { $splice: [[wordIndexStart, wordIndexEnd - wordIndexStart + 1, ...newWords]] },
    },
  })

  return {
    ...state,
    paragraphs,
  }
}

function updateWords(state: ITranscript, paragraphIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) {
  const newWords = Array<IWord>()

  if (recalculate === false) {
    //////////////////////
    // No recalculation //
    //////////////////////

    for (const [index, word] of words.entries()) {
      newWords.push({
        confidence: 1,
        endTime: state.paragraphs[paragraphIndex].words[wordIndexEnd + index].endTime,
        startTime: state.paragraphs[paragraphIndex].words[wordIndexStart + index].startTime,
        text: word,
      })
    }
  } else {
    ///////////////////
    // Recalculation //
    ///////////////////

    const textLengthWithoutSpaces = words.join("").length

    const wordStart = state.paragraphs[paragraphIndex].words[wordIndexStart]
    const wordEnd = state.paragraphs[paragraphIndex].words[wordIndexEnd]

    if (textLengthWithoutSpaces === 0) {
      // Delete words
      return deleteWords(state, paragraphIndex, wordIndexStart, wordIndexEnd)
    }

    const nanosecondsPerCharacter = (wordEnd.endTime - wordStart.startTime) / textLengthWithoutSpaces

    let startTime = wordStart.startTime
    for (const word of words) {
      const duration = word.length * nanosecondsPerCharacter
      const endTime = startTime + duration

      newWords.push({
        confidence: 1,
        endTime,
        startTime,
        text: word,
      })

      startTime = endTime
    }
  }

  // Replace array of words in correct position

  const paragraphs = update(state.paragraphs, {
    [paragraphIndex]: {
      words: { $splice: [[wordIndexStart, wordIndexEnd - wordIndexStart + 1, ...newWords]] },
    },
  })

  return {
    ...state,
    paragraphs,
  }
}

function updateStartTime(state: ITranscript, startTime: number) {
  const transcript = update(state, {
    metadata: {
      startTime: { $set: startTime },
    },
  })

  return transcript
}

function updateFramesPerSecond(state: ITranscript, framesPerSecond: number) {
  const transcript = update(state, {
    metadata: {
      framesPerSecond: { $set: framesPerSecond },
    },
  })

  return transcript
}

function updateSpeaker(state: ITranscript, paragraphIndex: number, speaker: number) {
  let paragraphs

  if ((state.paragraphs && state.paragraphs[paragraphIndex].speaker === speaker) || speaker === 0) {
    // Remove speaker

    paragraphs = update(state.paragraphs, {
      [paragraphIndex]: {
        speaker: { $set: null },
      },
    })
  } else {
    // Add speaker

    paragraphs = update(state.paragraphs, {
      [paragraphIndex]: {
        speaker: { $set: speaker },
      },
    })
  }

  return {
    ...state,
    paragraphs,
  }
}

function updateSpeakerName(state: ITranscript, speaker: number, name: string, paragraphIndex?: number) {
  let speakerNames

  // Setting speaker names
  if (state.speakerNames) {
    speakerNames = update(state.speakerNames, {
      [speaker]: { $set: name },
    })
  } else {
    speakerNames = { [speaker]: name }
  }

  let paragraphs
  if (paragraphIndex !== undefined) {
    paragraphs = update(state.paragraphs, {
      [paragraphIndex]: {
        speaker: { $set: speaker },
      },
    })
  } else {
    paragraphs = state.paragraphs
  }

  return {
    ...state,
    paragraphs,
    speakerNames,
  }
}

function joinParagraphs(state: ITranscript, paragraphIndex: number, wordIndex: number) {
  // Can't join the first paragraph, or if selected word is not the first one
  if (paragraphIndex === 0 || wordIndex !== 0) {
    return state
  }

  const paragraphs: IParagraph[] = update(state.paragraphs, {
    [paragraphIndex - 1]: {
      words: { $push: state.paragraphs[paragraphIndex].words }, // Push words from selected paragraph to previous paragraph
    },
    $splice: [[paragraphIndex, 1]], // Removes selected paragraph
  })

  return {
    ...state,
    paragraphs,
  }
}
function splitParagraph(state: ITranscript, paragraphIndex: number, wordIndex: number) {
  // Return if we're at the last word in the paragraph
  if (wordIndex === state.paragraphs[paragraphIndex].words.length - 1) {
    return state
  }

  // The split will be done from the next word
  const start = wordIndex + 1

  // Making a deep copy of the paragraphs, splicing off the rest of the words in the current paragraph
  const paragraphs: IParagraph[] = update(state.paragraphs, {
    [paragraphIndex]: {
      words: { $splice: [[start]] },
    },
  })

  // Deep clone the the rest of the words, which will be moved to the next paragraph
  const words: IWord[] = JSON.parse(JSON.stringify(state.paragraphs[paragraphIndex].words.slice(start)))

  // We push a new paragraph to the array

  const paragraph: IParagraph = {
    id: database.collection("/dummypath").doc().id,
    startTime: words[0].startTime,
    words,
  }

  // Insert the new paragraph in the correct place
  paragraphs.splice(paragraphIndex + 1, 0, paragraph)

  return {
    ...state,
    paragraphs,
  }
}
