import createHistory from "history/createBrowserHistory"
import * as React from "react"
import ReactGA from "react-ga"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import "../css/App.css"
import { auth } from "../firebaseApp"
import Index from "./Index"
import Transcript from "./Transcript"
import Transcripts from "./Transcripts"

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
    this.state = {}
  }

  public async componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user })
        // Set Google Analytics ID
        ReactGA.set({ userId: user.uid })
      } else {
        // history.push("login")
      }
    })
  }

  public render() {
    return (
      <BrowserRouter>
        <div className="container">
          <header className="org-color-dark">
            <svg height="17" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55.9 20" enableBackground="new 0 0 55.9 20" xmlSpace="preserve">
              <g>
                <rect x="0" y="0.4" fill="#FFFFFF" width="6.9" height="19.6" />
                <rect x="19.6" y="0.4" fill="#FFFFFF" width="6.9" height="19.6" />
                <rect x="35.1" y="0.4" fill="#FFFFFF" width="6.9" height="19.6" />
                <ellipse fill="#FFFFFF" cx="30.8" cy="3.9" rx="3.9" ry="3.9" />
                <path
                  fill="#FFFFFF"
                  d="M50.5,11.1c-0.4-0.7-0.4-1.1,0-1.8l5.4-8.9h-7.5c0,0-4.5,7.4-5.2,8.4c-0.6,1-0.6,1.7,0,2.7
		c0.6,1.1,5.1,8.4,5.1,8.4h7.5C55.9,20,50.6,11.2,50.5,11.1z"
                />
                <path fill="#FFFFFF" d="M15.5,3.5c-0.4-1.8-1.9-3.1-3.8-3.1l0,0H7.3L11.7,20h7.5L15.5,3.5z" />
              </g>
            </svg>
            <h1 className="org-text-l">Transkribering {process.env.NODE_ENV === "development" ? "(utvikling)" : ""}</h1>
            <div className="user">
              {this.state.user !== undefined ? this.state.user.displayName : <a href="/login">Logg inn</a>}
              {process.env.NODE_ENV === "development" && this.state.user !== undefined ? ` (${this.state.user.uid})` : ""}
            </div>
          </header>
          <Switch>
            <Redirect from="/login" to="/" />
            <Route exact={true} path="/" render={() => (this.state.user ? <Redirect to="/transcripts" /> : <Index />)} />
            <Route path="/transcripts" exact={true} render={props => <Transcripts {...props} user={this.state.user} />} />
            <Route path="/transcripts/:id" component={Transcript} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
