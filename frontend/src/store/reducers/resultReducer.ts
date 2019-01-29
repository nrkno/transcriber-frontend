import update from "immutability-helper"
import { Action } from "redux"

const initState = {}

const resultReducer = (state = initState, action: Action) => {
  console.log("resultReducer: ", action.type)

  switch (action.type) {
    case "RESULT_READ":
      console.log("action.payload", action.payload)

      return {
        results: action.payload,
      }

    case "WRITE_WORD":
      console.log("WRITE_WORD")

      const { isEditedByUser, resultIndex, text, wordIndex } = action

      console.log("KOMMER HIT", isEditedByUser, resultIndex, text, wordIndex)

      console.log("setWord", resultIndex, wordIndex)

      const results = update(state.results, {
        [resultIndex]: {
          words: {
            [wordIndex]: {
              confidence: { $set: isEditedByUser ? 1 : this.props.results.results[resultIndex].words[wordIndex].confidence },
              word: { $set: text },
            },
          },
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
