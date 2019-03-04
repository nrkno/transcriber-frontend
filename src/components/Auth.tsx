import React, { Component } from "react"
import ReactGA from "react-ga"
import { connect } from "react-redux"
import { FirebaseReducer } from "react-redux-firebase"
import { withFirebase } from "react-redux-firebase"
import { RouteComponentProps } from "react-router"
import { compose } from "redux"

interface IStateProps {
  auth: FirebaseReducer.Auth
  logout: () => void
}

class Auth extends Component<RouteComponentProps<{}> & IStateProps, any> {
  public render() {
    console.log("this.props", this.props)
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
  private async logout() {
    ReactGA.event({
      action: "log out button pressed",
      category: "authentication",
    })

    this.props.firebase.logOut()

    try {
      this.props.history.push("/")
      this.props.logout()
    } catch (error) {
      console.error(error)
      ReactGA.exception({
        description: error.message,
        fatal: false,
      })
    }
  }
}
/*
const mapStateToProps = (state: State): IStateProps => {
  return {
    user: state.firebase.auth,
  }
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  return {
    // fetchUser: () => dispatch(fetchUser()),
    logOut: () => dispatch(logOut()),
  }
}

export default connect<IStateProps, IDispatchProps, void>(
  mapStateToProps,
  mapDispatchToProps,
)(Auth)
// export default withRouter(Login)




const enhance = compose(
  withFirestore,
  connect<void, IDispatchProps, void>(
    mapStateToProps,
    mapDispatchToProps,
  ),
)
*/

export default compose(
  withFirebase,
  connect(
    // Map redux state to component props
    ({ firebase: { auth, profile } }) => ({
      auth,
      profile,
    }),
  ),
)(Auth)
