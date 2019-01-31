import { applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"
import rootReducer from "./reducers/rootReducer"

const initialState = {}

export default () => {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk), // to add other middleware
  )
}
