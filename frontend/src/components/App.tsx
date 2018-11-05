import createHistory from "history/createBrowserHistory"
import * as React from "react"
import ReactGA from "react-ga"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import "../css/App.css"
import Transcript from "./Transcript"
import Upload from "./Upload"

ReactGA.initialize(process.env.GOOGLE_ANALYTICS_PROPERTY_ID, {
  debug: process.env.NODE_ENV === "development",
})

const history = createHistory()
history.listen((location, action) => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
})

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <div className="container">
          <header>
            <h1>NRK transkribering {process.env.NODE_ENV === "development" ? "(utvikling)" : ""}</h1>
          </header>
          <Switch>
            <Route exact={true} path="/" component={Upload} />
            <Route path="/transcripts/:id" component={Transcript} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
