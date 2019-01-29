import { Action } from "redux"

const initState = {}

const authReducer = (state = initState, action: Action) => {
  console.log("authReducer: ", action.type)

  switch (action.type) {
    case "RESULT_READ":
      console.log("action.payload", action.payload)

      return {
        results: action.payload,
      }

    default:
      return state
  }
}

export default authReducer
