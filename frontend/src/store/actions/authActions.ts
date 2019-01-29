import { User } from "firebase"
import { Dispatch } from "redux"

export const fetchUser = () => (dispatch: Dispatch, getState, { getFirebase }) => {
  console.log("ACtion: Fetch usert")

  const firebase = getFirebase()

  firebase.auth().onAuthStateChanged((user: User) => {
    console.log("onAuthStateChanged")

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

export const logOut = () => async (dispatch: Dispatch, getState, { getFirebase }) => {
  console.log("Action: LOG OUT user")

  const firebase = getFirebase()

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
