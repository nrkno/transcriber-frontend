import update from "immutability-helper"
import { Action } from "redux"

const initState = {}

const resultReducer = (state = initState, action: Action) => {
  switch (action.type) {
    case "RESULT_READ":
      console.log("action.payload", action.payload)

      return {
        results: action.payload,
      }

    case "UPDATE_WORDS":
      const { recalculate, resultIndex, wordIndexEnd, wordIndexStart, words } = action

      console.log("UPDATE_WORD reducer", resultIndex, wordIndexStart, wordIndexEnd, words, recalculate)

      const newWords = Array<IWord>()

      if (recalculate === false) {
        console.log("Don't recalc")

        for (const [index, word] of words.entries()) {
          console.log(index, word)

          newWords.push({
            confidence: 1,
            endTime: state.results[resultIndex].words[wordIndexEnd + index].endTime,
            startTime: state.results[resultIndex].words[wordIndexStart + index].startTime,
            word,
          })
        }
      }

      console.log("newWords", newWords)

      // Replace array of words in correct position
      const results = update(state.results, {
        [resultIndex]: {
          words: { $splice: [[wordIndexStart, wordIndexEnd - wordIndexStart + 1, ...newWords]] },
        },
      })

      /*TODO const resultIndecesWithChanges = update(this.state.resultIndecesWithChanges, {
      [resultIndex]: { $set: true },
    })*/

      return {
        results,
      }

    default:
      return state
  }
}

export default resultReducer
