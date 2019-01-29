import { Action } from "redux"

const initState = { authError: null }

const authReducer = (state = initState, action: Action) => {
  switch (action.type) {
    case "LOGGED_IN_SUCCESS":
      console.log("FETCH_USER success")

      return {
        authError: null,
      }
    case "LOGGED_OUT":
      console.log("FETCH_USER success")

      return {
        authError: null,
      }
    default:
      return state
  }
}

export default authReducer
