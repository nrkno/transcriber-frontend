import { createAction } from "typesafe-actions"

export const updateMarkers = createAction("UPDATE_MARKERS", action => {
  return (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => action({ resultIndex, wordIndexStart, wordIndexEnd })
})

import { Dispatch } from "redux"
export const updateMarkers2 = (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => (dispatch: Dispatch) => {
  dispatch({
    resultIndex,
    type: "UPDATE_MARKERS",
    wordIndexEnd,
    wordIndexStart,
  })
}
