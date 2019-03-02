import { ActionType, getType } from "typesafe-actions"
import * as markers from "../actions/markersActions"

export type MarkersAction = ActionType<typeof markers>

interface IState {
  readonly resultIndex?: number
  wordIndexStart?: number
  wordIndexEnd?: number
}

export default (state: IState = {}, action: MarkersAction) => {
  switch (action.type) {
    case getType(markers.updateMarkers):
      const payload = action.payload
      return { ...payload }

    default:
      return state
  }
}
