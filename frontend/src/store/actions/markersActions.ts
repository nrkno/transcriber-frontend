import { createAction } from "typesafe-actions"

export const updateMarkers = createAction("UPDATE_MARKERS", action => {
  return (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => action({ resultIndex, wordIndexStart, wordIndexEnd })
})
