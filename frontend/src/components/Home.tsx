import React from "react"
import { functions } from "../firebaseApp"

async function loginFn() {
  const login = functions.httpsCallable("authenticate/login")

  login({}).then(result => {
    console.log(result)
  })
}

const Home = () => {
  return (
    <div className="wrapper">
      <div className="dropForm">
        <button className="nrk-button" onClick={loginFn} type="submit">
          Logg inn
        </button>
      </div>
    </div>
  )
}

export default Home
