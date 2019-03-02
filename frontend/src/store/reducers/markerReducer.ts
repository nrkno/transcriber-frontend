import { ActionType, getType } from "typesafe-actions"
import * as markers from "../actions/markersActions"

export type MarkersAction = ActionType<typeof markers>

interface IState {
  resultIndex?: number
  wordIndexStart?: number
  wordIndexEnd?: number
}

export default (state: IState = {}, action: MarkersAction) => {
  switch (action.type) {
    case getType(markers.updateMarkers):
      const payload = action.payload
      return { ...state, ...payload }

    default:
      return state
  }
}
