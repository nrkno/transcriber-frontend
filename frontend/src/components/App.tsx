import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import "../css/App.css"

import Result from "./Result"
import Upload from "./Upload"

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
