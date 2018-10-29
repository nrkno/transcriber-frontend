import createHistory from "history/createBrowserHistory"
import * as React from "react"
import ReactGA from "react-ga"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import "../css/App.css"
import { auth } from "../firebaseApp"
// import Upload from "./Upload"
import Home from "./Home"
import Transcript from "./Transcript"

ReactGA.initialize(process.env.GOOGLE_ANALYTICS_PROPERTY_ID, {
  debug: process.env.NODE_ENV === "development",
})

const history = createHistory()
history.listen((location, action) => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
})

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User is logged in")
    // startApp()
  } else {
    const url = window.location.href
    if (url.indexOf("jwt=") > -1) {
      // The minted firebase token from Auth function
      const token = url.substr(url.indexOf("jwt=") + 4)
      console.log(token)
      auth
        .signInWithCustomToken(token)
        .then(user => {
          console.log(user)
          // window.location.href = "/"
        })
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          console.error(errorCode + " " + errorMessage)
        })
    } else {
      console.log("User not authenticated and no custom token present. Redirect to Azure AD for authentication token")
      return
      // User not authenticated and no custom token present. Redirect to Azure AD for authentication token
      let redirectUrl = "https://login.microsoftonline.com/YOURTENANTNAME.onmicrosoft.com/oauth2/authorize?client_id=APPCLIENTID&&response_type=id_token&scope=openid&nonce=42&response_mode=form_post" // TODO: Replace YOURTENANTNAME and APPCLIENTID
      if (window.location.port === "5000") {
        // Adjust the requested redirectUri for local development
        redirectUrl = redirectUrl + "&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth"
      }
      window.location.href = redirectUrl
    }
  }
})

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header>
            <h1>NRK transkribering {process.env.NODE_ENV === "development" ? "(utvikling)" : ""}</h1>
          </header>
          <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route path="/transcripts/:id" component={Transcript} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
