import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { getFirebase, ReactReduxFirebaseProvider, ReactReduxFirebaseProviderProps } from "react-redux-firebase"
import { applyMiddleware, compose, createStore } from "redux"
import { getFirestore } from "redux-firestore"
import { createFirestoreInstance } from "redux-firestore"
import thunk from "redux-thunk"
import App from "./components/App"
import firebase from "./firebaseApp"
import rootReducer from "./store/reducers/rootReducer"

async function getToken() {
  try {
    const response = await fetch("/token")
    console.log("Fetched token response: ", response)
    const json = await response.json()
    console.log("Token as json: ", json)
    const auth = firebase.auth()
    await auth.signInWithCustomToken(json.token)

    auth.onAuthStateChanged(user => {
      console.log("onAuthStateChanged", user)
    })
  } catch (error) {
    console.error("Failed to fetch valid token from Firebas. This method expects that an user is loged in. Reason: ", error)
  }
}

async function loginDev(username: string, password: string) {
  console.warn("Login with dev credentials. Username: ", username)
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(username, password)
    await userCredential.user!.updateProfile({ displayName: "DevUser: " + username, photoURL: null })
  } catch (error) {
    const errorCode = error.code
    const errorMessage = error.message

    console.error(errorCode, errorMessage)
  }
}
const development = process.env.NODE_ENV === "development"
if (development) {
  const username = process.env.REACT_APP_FIREBASE_DEV_USERNAME || "not-set"
  const password = process.env.REACT_APP_FIREBASE_DEV_PASSWORD || "not-set"
  loginDev(username, password)
} else {
  getToken()
}

// Create store with reducers and initial state

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const initialState = {}
const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))))

const rrfProps: ReactReduxFirebaseProviderProps = {
  config: {
    useFirestoreForProfile: true,
    userProfile: "users",
  },
  createFirestoreInstance,
  dispatch: store.dispatch,
  firebase,
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root") as HTMLElement,
)
// registerServiceWorker()
