import update from "immutability-helper"
import { ActionType } from "typesafe-actions"
import { database } from "../../firebaseApp"
import { IResult, ITranscript, IWord } from "../../interfaces"
import * as transcriptActions from "../actions/transcriptActions"
import { DELETE_WORDS, JOIN_RESULTS, READ_RESULTS, SELECT_TRANSCRIPT, SPLIT_RESULTS, UPDATE_SPEAKER, UPDATE_SPEAKER_NAME, UPDATE_START_TIME, UPDATE_WORDS } from "../constants"

export type TranscriptAction = ActionType<typeof transcriptActions>

export default (state: ITranscript = {}, action: TranscriptAction) => {
  switch (action.type) {
    //////////
    // READ //
    //////////

    case READ_RESULTS:
      return readResults(state, action.payload.results)
    case SELECT_TRANSCRIPT:
      return selectTranscript(action.payload.transcriptId, action.payload.transcript)

    ////////////
    // UPDATE //
    ////////////

    case UPDATE_SPEAKER:
      return updateSpeaker(state, action.payload.resultIndex, action.payload.speaker)

    case UPDATE_SPEAKER_NAME:
      return updateSpeakerName(state, action.payload.speaker, action.payload.name, action.payload.resultIndex)

    case UPDATE_START_TIME:
      return updateStartTime(state, action.payload.startTime)

    case UPDATE_WORDS:
      return updateWords(state, action.payload.resultIndex, action.payload.wordIndexStart, action.payload.wordIndexEnd, action.payload.words, action.payload.recalculate)

    case SPLIT_RESULTS:
      return splitResult(state, action.payload.resultIndex, action.payload.wordIndex)

    case JOIN_RESULTS:
      return joinResults(state, action.payload.resultIndex, action.payload.wordIndex)

    ////////////
    // DELETE //
    ////////////

    case DELETE_WORDS:
      return deleteWords(state, action.payload.resultIndex, action.payload.wordIndexStart, action.payload.wordIndexEnd)

    default:
      return state
  }
}

function readResults(state: ITranscript, results: IResult[]) {
  return {
    ...state,
    results,
  }
}

function selectTranscript(transcriptId: string, transcript: ITranscript) {
  return {
    id: transcriptId,
    ...transcript,
  }
}

function deleteWords(state: ITranscript, resultIndex: number, wordIndexStart: number, wordIndexEnd: number) {
  const newWords = Array<IWord>()

  for (let i = wordIndexStart; i <= wordIndexEnd; i++) {
    const word = state.results[resultIndex].words[i]

    newWords.push({
      ...word,
      deleted: true,
    })
  }

  // Replace array of words in correct position

  const results = update(state.results, {
    [resultIndex]: {
      words: { $splice: [[wordIndexStart, wordIndexEnd - wordIndexStart + 1, ...newWords]] },
    },
  })

  return {
    ...state,
    results,
  }
}

function updateWords(state: ITranscript, resultIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) {
  const newWords = Array<IWord>()

  if (recalculate === false) {
    //////////////////////
    // No recalculation //
    //////////////////////

    for (const [index, word] of words.entries()) {
      newWords.push({
        confidence: 1,
        endTime: state.results[resultIndex].words[wordIndexEnd + index].endTime,
        startTime: state.results[resultIndex].words[wordIndexStart + index].startTime,
        word,
      })
    }
  } else {
    ///////////////////
    // Recalculation //
    ///////////////////

    const textLengthWithoutSpaces = words.join("").length

    const wordStart = state.results[resultIndex].words[wordIndexStart]
    const wordEnd = state.results[resultIndex].words[wordIndexEnd]

    if (textLengthWithoutSpaces === 0) {
      // Delete words
      return deleteWords(state, resultIndex, wordIndexStart, wordIndexEnd)
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
        word,
      })

      startTime = endTime
    }
  }

  // Replace array of words in correct position

  const results = update(state.results, {
    [resultIndex]: {
      words: { $splice: [[wordIndexStart, wordIndexEnd - wordIndexStart + 1, ...newWords]] },
    },
  })

  return {
    ...state,
    results,
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

function updateSpeaker(state: ITranscript, resultIndex: number, speaker: number) {
  let results

  if ((state.results && state.results[resultIndex].speaker === speaker) || speaker === 0) {
    // Remove speaker

    results = update(state.results, {
      [resultIndex]: {
        speaker: { $set: null },
      },
    })
  } else {
    // Add speaker

    results = update(state.results, {
      [resultIndex]: {
        speaker: { $set: speaker },
      },
    })
  }

  return {
    ...state,
    results,
  }
}

function updateSpeakerName(state: ITranscript, speaker: number, name: string, resultIndex?: number) {
  let speakerNames

  // Setting speaker names
  if (state.speakerNames) {
    speakerNames = update(state.speakerNames, {
      [speaker]: { $set: name },
    })
  } else {
    speakerNames = { [speaker]: name }
  }

  let results
  if (resultIndex !== undefined) {
    results = update(state.results, {
      [resultIndex]: {
        speaker: { $set: speaker },
      },
    })
  } else {
    results = state.results
  }

  return {
    ...state,
    results,
    speakerNames,
  }
}

function joinResults(state: ITranscript, resultIndex: number, wordIndex: number) {
  // Can't join the first result, or if selected word is not the first one
  if (resultIndex === 0 || wordIndex !== 0) {
    return state
  }

  const results: IResult[] = update(state.results, {
    [resultIndex - 1]: {
      words: { $push: state.results[resultIndex].words }, // Push words from selected result to previous result
    },
    $splice: [[resultIndex, 1]], // Removes selected result
  })

  return {
    ...state,
    results,
  }
}
function splitResult(state: ITranscript, resultIndex: number, wordIndex: number) {
  // Return if we're at the last word in the result
  if (wordIndex === state.results[resultIndex].words.length - 1) {
    return state
  }

  // The split will be done from the next word
  const start = wordIndex + 1

  // Making a deep copy of the results, splicing off the rest of the words in the current result
  const results: IResult[] = update(state.results, {
    [resultIndex]: {
      words: { $splice: [[start]] },
    },
  })

  // Deep clone the the rest of the words, which will be moved to the next result
  const words: IWord[] = JSON.parse(JSON.stringify(state.results[resultIndex].words.slice(start)))

  // We push a new result to the array

  const result: IResult = {
    id: database.collection("/dummypath").doc().id,
    startTime: words[0].startTime,
    words,
  }

  // Insert the new result in the correct place
  results.splice(resultIndex + 1, 0, result)

  return {
    ...state,
    results,
  }
}
