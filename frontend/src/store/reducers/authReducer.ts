import { Action } from "redux"

const initState = { authError: null }

const authReducer = (state = initState, action: Action) => {
  switch (action.type) {
    case "LOGGED_IN_SUCCESS":
      return {
        authError: null,
      }
    case "LOGGED_OUT":
      return {
        authError: null,
      }
    default:
      return state
  }
}

export default authReducer
