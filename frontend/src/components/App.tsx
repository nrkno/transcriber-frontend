import * as React from "react"
import ReactGA from "react-ga"
import { connect } from "react-redux"
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom"
import "../css/App.css"
import { auth } from "../firebaseApp"
import GAListener from "./GAListener"
import Index from "./Index"
import Login from "./Login"
import Transcripts from "./Transcripts"

ReactGA.initialize(process.env.GOOGLE_ANALYTICS_PROPERTY_ID, {
  debug: false /* process.env.NODE_ENV === "development"*/,
  titleCase: false,
})

interface IStateProps {
  user?: firebase.User
}

class App extends React.Component<any, IState> {
  public async componentDidMount() {
    /*try {
      const userCredential = await auth.signInWithEmailAndPassword("andreas@schjonhaug.com", "andreas")
      await userCredential.user!.updateProfile({ displayName: "Andreas Schjønhaug", photoURL: null })
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message

      console.error(errorCode, errorMessage)
    }*/
    /*auth.onAuthStateChanged(user => {
      if (user) {
        // Set Google Analytics ID
        this.setState({ user })
        ReactGA.set({ userId: user.uid })
      }
    })*/
  }

  public render() {
    return (
      <BrowserRouter>
        <GAListener>
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
              <h1 className="org-text-l logo">
                <Link to="/"> Transkribering {process.env.NODE_ENV === "development" ? "(utvikling)" : ""}</Link>
              </h1>

              <Login logout={this.logout} />
            </header>
            <Switch>
              <Redirect from="/login" to="/" />
              <Route path="/" exact={true} render={() => (this.props.user.uid ? <Redirect to="/transcripts" /> : <Index />)} />
              <Route path="/transcripts/:id?" render={props => <Transcripts {...props} user={this.props.user} />} />
            </Switch>
          </div>
        </GAListener>
      </BrowserRouter>
    )
  }

  private logout = async () => {
    this.setState({ user: undefined })
    ReactGA.set({ userId: null })
    try {
      await auth.signOut()
    } catch (error) {
      ReactGA.exception({
        description: error.message,
        fatal: false,
      })
      console.error(error)
    }
  }
}

const mapStateToProps = (state: State): IStateProps => {
  return {
    user: state.firebase.auth,
  }
}

export default connect<IStateProps, void, void>(mapStateToProps)(App)
