import update from "immutability-helper"
import { Action } from "redux"
import { database } from "../../firebaseApp"
import { IResult, ITranscript, IWord } from "../../interfaces"

const initState: ITranscript = {}

const transcriptReducer = (state = initState, action: Action) => {
  switch (action.type) {
    //////////
    // READ //
    //////////
    case "READ_RESULTS":
      return {
        ...state,
        results: action.results,
      }
    case "SELECT_TRANSCRIPT":
      const transcriptId = action.transcriptId
      const transcript = action.transcript

      return {
        id: transcriptId,
        ...transcript,
      }

    ////////////
    // UPDATE //
    ////////////

    case "UPDATE_SPEAKER":
      return updateSpeaker(action.resultIndex, action.speaker)

    case "UPDATE_SPEAKER_NAME":
      return updateSpeakerName(action.speaker, action.name)

    case "UPDATE_WORDS":
      const { recalculate, resultIndex, wordIndexEnd, wordIndexStart, words } = action

      const newWords = Array<IWord>()

      if (recalculate === false) {
        //////////////////////
        // No recalculation //
        //////////////////////

        for (const [index, word] of words.entries()) {
          console.log(index, word)

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
          console.log("TODO: HSOULD DELETE")
          this.deleteWords(resultIndex, wordIndexStart, wordIndexEnd, true)
          return
        }

        console.log("textLengthWithoutSpaces", textLengthWithoutSpaces)

        const nanosecondsPerCharacter = (wordEnd.endTime - wordStart.startTime) / textLengthWithoutSpaces
        console.log("nanosecondsPerCharacter", nanosecondsPerCharacter)

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

    case "SPLIT_RESULTS":
      return splitResult(action.resultIndex, action.wordIndex, state)

    case "JOIN_RESULTS":
      console.log("JOIN_RESULTS reducer", state)

      return joinResults(action.resultIndex, action.wordIndex, state)

    default:
      return state
  }

  function updateSpeaker(resultIndex: number, speaker: number) {
    console.log("UPdate speaker", resultIndex, speaker)
    let results

    if (state.results[resultIndex].speaker === speaker || speaker === 0) {
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

    console.log("new resulrts", results)

    return {
      ...state,
      results,
    }
  }

  function updateSpeakerName(speaker: number, name: string) {
    let speakerNames

    if (state.speakerNames) {
      speakerNames = update(state.speakerNames, {
        [speaker]: { $set: name },
      })
    } else {
      speakerNames = { [speaker]: name }
    }

    return {
      ...state,
      speakerNames,
    }
  }

  function joinResults(resultIndex: number, wordIndex: number, state: State) {
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
  function splitResult(resultIndex: number, wordIndex: number, state: State) {
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
}

export default transcriptReducer
