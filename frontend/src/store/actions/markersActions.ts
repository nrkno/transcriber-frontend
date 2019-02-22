export const updateMarkers = (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => (dispatch: Dispatch) => {
  dispatch({
    resultIndex,
    type: "UPDATE_MARKERS",
    wordIndexEnd,
    wordIndexStart,
  })
}
