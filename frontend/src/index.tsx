import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"
import "firebase/functions"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { ReactReduxFirebaseProvider } from "react-redux-firebase"
import { applyMiddleware, combineReducers, compose, createStore } from "redux"
import { createFirestoreInstance } from "redux-firestore"
import { firestoreReducer, getFirestore, reduxFirestore } from "redux-firestore"
import thunk from "redux-thunk"
import App from "./components/App"
import createReduxStore from "./store/createReduxStore"

// import registerServiceWorker from "./registerServiceWorker"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "nrk-transkribering-development.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
}

// react-redux-firebase config
const rrfConfig = {
  // userProfile: 'users',
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

// Initialize firebase instance
firebase.initializeApp(firebaseConfig)
// Initialize other services on firebase instance
firebase.firestore()
firebase.functions()

// Create store with reducers and initial state
const initialState = {}
const store = createReduxStore()

const rrfProps = {
  config: rrfConfig,
  createFirestoreInstance,
  dispatch: store.dispatch,
  firebase,
}

// Setup react-redux so that connect HOC can be used
ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root") as HTMLElement,
)
