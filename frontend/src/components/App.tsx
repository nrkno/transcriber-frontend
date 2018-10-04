import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import "../css/App.css"
import ReactGA from "react-ga"
import Result from "./Result"
import Upload from "./Upload"
import createHistory from "history/createBrowserHistory"

ReactGA.initialize(process.env.GOOGLE_ANALYTICS_PROPERTY_ID, {
  debug: process.env.NODE_ENV === "development"
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
        <div className="App">
          <header>
            <h1>
              NRK transkribering{" "}
              {process.env.NODE_ENV === "development" ? "(utvikling)" : ""}
            </h1>
          </header>
          <Switch>
            <Route exact={true} path="/" component={Upload} />
            <Route path="/:id" component={Result} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
