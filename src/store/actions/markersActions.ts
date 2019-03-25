import { createAction } from "typesafe-actions"
import { UPDATE_MARKERS } from "../constants"

export const updateMarkers = createAction(UPDATE_MARKERS, action => {
  return (paragraphIndex: number, wordIndexStart: number, wordIndexEnd: number) => action({ paragraphIndex, wordIndexStart, wordIndexEnd })
})
