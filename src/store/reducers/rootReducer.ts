import { firebaseReducer } from "react-redux-firebase"
import { combineReducers } from "redux"
import { firestoreReducer } from "redux-firestore"
import undoable from "redux-undo"
import markerReducer from "./markerReducer"
import transcriptReducer from "./transcriptReducer"

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  markers: undoable(markerReducer),
  transcript: undoable(transcriptReducer),
})

export default rootReducer
