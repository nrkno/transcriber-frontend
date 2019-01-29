import { firebaseReducer } from "react-redux-firebase"
import { combineReducers } from "redux"
import { firestoreReducer } from "redux-firestore"
import undoable from "redux-undo"
import authReducer from "./authReducer"
import resultReducer from "./resultReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  results: undoable(resultReducer),
  // results: resultReducer,
})

export default rootReducer
