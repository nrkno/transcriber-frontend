import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { getFirebase, ReactReduxFirebaseProvider } from "react-redux-firebase"
import { applyMiddleware, compose, createStore } from "redux"
import { getFirestore } from "redux-firestore"
import { createFirestoreInstance } from "redux-firestore" // <- needed if using firestore
import thunk from "redux-thunk"
import App from "./components/App"
import firebase from "./firebaseApp"
import rootReducer from "./store/reducers/rootReducer"

// react-redux-firebase config
const rrfConfig = {
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  userProfile: "users",
}

// Create store with reducers and initial state

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const initialState = {}
const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))))

const rrfProps: ReactReduxFirebaseProviderProps = {
  config: rrfConfig,
  createFirestoreInstance, // <- needed if using firestore
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
