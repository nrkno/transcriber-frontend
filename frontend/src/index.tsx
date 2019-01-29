import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { getFirebase, reactReduxFirebase } from "react-redux-firebase"
import { applyMiddleware, compose, createStore } from "redux"
import thunk from "redux-thunk"
import App from "./components/App"
import firebaseApp from "./firebaseApp"
import rootReducer from "./store/reducers/rootReducer"
// import registerServiceWorker from "./registerServiceWorker"

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase })),
    reactReduxFirebase(firebaseApp, {}),
  ),
)
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
)
// registerServiceWorker()
