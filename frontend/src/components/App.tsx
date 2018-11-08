import createHistory from "history/createBrowserHistory"
import * as React from "react"
import ReactGA from "react-ga"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import "../css/App.css"
import { auth } from "../firebaseApp"
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

interface IState {
  user?: firebase.User
}

class App extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      user: undefined,
    }
  }

  public async componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("onAuthStateChanged")
        console.log(user)
        this.setState({ user })
      }
    })
  }

  public render() {
    return (
      <BrowserRouter>
        <div className="container">
          <header className="org-color-dark">
            <h1 className="org-text-l">Transkribering {process.env.NODE_ENV === "development" ? "(utvikling)" : ""}</h1>
            <div className="user">{this.state.user !== undefined ? this.state.user.displayName : ""}</div>
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
