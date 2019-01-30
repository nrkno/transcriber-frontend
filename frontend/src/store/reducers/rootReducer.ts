import { firebaseReducer } from "react-redux-firebase"
import { combineReducers } from "redux"
import { firestoreReducer } from "redux-firestore"
import undoable from "redux-undo"
import authReducer from "./authReducer"
import transcriptReducer from "./transcriptReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  transcript: undoable(transcriptReducer),
})

export default rootReducer

/*

import undoable, { groupByActionTypes } from "redux-undo"

transcript: undoable(transcriptReducer, { groupBy: groupByActionTypes("UPDATE_WORDS") }),


*/
