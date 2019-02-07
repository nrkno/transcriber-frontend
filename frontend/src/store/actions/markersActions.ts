export const updateMarkers = (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => (dispatch: Dispatch) => {
  console.log("updateMarkers action")

  dispatch({
    resultIndex,
    type: "UPDATE_MARKERS",
    wordIndexEnd,
    wordIndexStart,
  })
}
