import { User } from "firebase"
import { Dispatch } from "redux"

export const fetchUser = () => (dispatch: Dispatch, getState) => {
  firebase.auth().onAuthStateChanged((user: User) => {
    if (user) {
      dispatch({
        type: "LOGGED_IN_SUCCESS",
      })
    } else {
      dispatch({
        type: "LOGGED_OUT",
      })
    }
  })
}

export const logOut = () => async (dispatch: Dispatch, getState) => {
  console.log("Action: LOG OUT user")

  try {
    await firebase.auth().signOut()

    dispatch({
      type: "LOGGED_OUT_SUCCESS",
    })
  } catch (error) {
    dispatch({
      type: "LOGGED_OUT_FAILED",
    })
  }
}
