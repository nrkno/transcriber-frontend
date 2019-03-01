import { ActionType, getType } from "typesafe-actions"
import * as markers from "../actions/markersActions"

export type MarkersAction = ActionType<typeof markers>

export default (state: Todo[] = [], action: MarkersAction) => {
  switch (action.type) {
    case getType(markers.updateMarkers):
      return [...state, action.payload]

    default:
      return state
  }
}
/*
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
*/
