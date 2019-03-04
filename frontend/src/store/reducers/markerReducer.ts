import { ActionType } from "typesafe-actions"
import * as markers from "../actions/markersActions"
import { UPDATE_MARKERS } from "../constants"

export type MarkersAction = ActionType<typeof markers>

interface IState {
  readonly resultIndex?: number
  readonly wordIndexStart?: number
  readonly wordIndexEnd?: number
}

export default (state: IState = {}, action: MarkersAction) => {
  switch (action.type) {
    //////////
    // READ //
    //////////

    case UPDATE_MARKERS:
      const payload = action.payload
      return { ...payload }

    default:
      return state
  }
}
