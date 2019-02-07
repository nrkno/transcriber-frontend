import { Action } from "redux"

const markerReducer = (state = {}, action: Action) => {
  switch (action.type) {
    case "UPDATE_MARKERS":
      const { resultIndex, wordIndexEnd, wordIndexStart } = action

      return {
        ...state,
        resultIndex,
        wordIndexEnd,
        wordIndexStart,
      }

    default:
      return state
  }
}

export default markerReducer
