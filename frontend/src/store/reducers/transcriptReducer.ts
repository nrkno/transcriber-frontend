import update from "immutability-helper"
import { Action } from "redux"
import { IWord } from "../../interfaces"

const initState = {}

const transcriptReducer = (state = initState, action: Action) => {
  switch (action.type) {
    //////////
    // READ //
    //////////
    case "READ_RESULTS":
      console.log("action.payload", action.results)

      return {
        ...state,
        results: action.results,
      }
    case "SELECT_TRANSCRIPT":
      console.log("SELECT_TRANSCRIPT reducer", state)

      const transcriptId = action.transcriptId
      const transcript = action.transcript

      return {
        id: transcriptId,
        ...transcript,
      }

    ////////////
    // UPDATE //
    ////////////
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

        // If original entered string ends with a space, we add it to the last word again
        /*TODO
        if (text.endsWith(" ")) {
          cleanText += " "
          newWords[newWords.length - 1].word += " "
        }
*/
        // Replace array of words in result

        /*this.setState({
          currentSelectedWordIndexEnd: wordIndexStart + newWords.length - 1,
          editString: cleanText, 
          results: newResults,
        })*/
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
      console.log("SPLIT_RESULTS reducer", state)

      return splitResult(action.resultIndex, action.wordIndex, state)

    default:
      return state
  }

  function splitResult(resultIndex: number, wordIndex: number, state: State) {
    console.log("SPLIt result", state)

    const results = state.results!

    // Return if we're at the last word in the result
    if (wordIndex === results[resultIndex].words.length - 1) {
      return state
    }

    // The split will be done from the next word
    const start = wordIndex + 1

    // Making a deep copy of the results, splicing off the rest of the words in the current result
    const newResults = update(results, {
      [resultIndex]: {
        words: { $splice: [[start]] },
      },
    })

    // Deep clone the the rest of the words, which will be moved to the next result
    const wordsToMove: IWord[] = JSON.parse(JSON.stringify(results[resultIndex].words.slice(start)))
    console.log("words to move", wordsToMove)

    // Check if there's another result after the current one
    if (resultIndex + 1 < results.length) {
      newResults[resultIndex + 1].words.splice(0, 0, ...wordsToMove)

      // Also need to update the start time of the result where we just added words
      newResults[resultIndex + 1].startTime = wordsToMove[0].startTime

      return {
        ...state,
        results: newResults,
      }
    } else {
      // We're at the last result, create a new one
      // We push a new result to the array

      const result: IResult = {
        startTime: wordsToMove[0].startTime,
        words: wordsToMove,
      }

      newResults.push(result)

      // We also need to create a new id in result ids.

      const resultId = database.collection("/dummypath").doc().id

      const resultIds = update(this.state.resultIds, { $push: [resultId] })

      return {
        resultIds,
        results: newResults,
      }
    }
  }
}

export default transcriptReducer
