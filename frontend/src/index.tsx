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
