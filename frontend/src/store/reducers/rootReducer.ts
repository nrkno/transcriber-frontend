import { firebaseReducer } from "react-redux-firebase"
import { combineReducers } from "redux"
import { firestoreReducer } from "redux-firestore"
import authReducer from "./authReducer"
import resultReducer from "./resultReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  results: resultReducer,
})

export default rootReducer
