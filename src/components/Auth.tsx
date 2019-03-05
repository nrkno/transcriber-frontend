import React, { Component } from "react"
import ReactGA from "react-ga"
import { connect } from "react-redux"
import { FirebaseReducer } from "react-redux-firebase"
import { withFirebase } from "react-redux-firebase"
import { RouteComponentProps, withRouter } from "react-router"
import { compose } from "redux"

interface IStateProps {
  auth: FirebaseReducer.Auth
  logout: () => void
}

class Auth extends Component<RouteComponentProps<{}> & IStateProps, any> {
  public render() {
    return (
      <div className="user">
        {(() => {
          if (this.props.auth.isLoaded === true && this.props.auth.uid) {
            let displayName = this.props.auth.displayName
            if (process.env.NODE_ENV === "development") {
              displayName += ` (${this.props.auth.uid})`
            }
            return (
              <>
                {displayName}
                <button className="org-btn" onClick={this.logout}>
                  Logg ut
                </button>
              </>
            )
          } else {
            return <a href="/login">Logg inn</a>
          }
        })()}
      </div>
    )
  }

  private logout = () => {
    this.props.history.push("/")
    this.props.firebase.logout()

    ReactGA.event({
      action: "log out button pressed",
      category: "authentication",
    })
  }
}

export default compose(
  withFirebase,
  connect(
    // Map redux state to component props
    ({ firebase: { auth, profile } }) => ({
      auth,
      profile,
    }),
  ),
  withRouter,
)(Auth)
