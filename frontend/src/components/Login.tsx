import React, { Component } from "react"
import ReactGA from "react-ga"
import { connect } from "react-redux"
import { RouteComponentProps, withRouter } from "react-router"
import { Dispatch } from "redux"

interface IProps {
  user?: firebase.User
  logout: () => void
}

interface IStateProps {
  user: firebase.User
}

class Login extends Component<RouteComponentProps<{}> & IProps, any> {
  public render() {
    return (
      <div className="user">
        {(() => {
          if (this.props.user.uid) {
            let displayName = this.props.user.displayName
            if (process.env.NODE_ENV === "development") {
              displayName += ` (${this.props.user.uid})`
            }
            return (
              <>
                {displayName}
                <button className="org-btn" onClick={() => this.logout()}>
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

    this.props.logOut()

    /*
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

    */
  }
}

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
)(Login)
// export default withRouter(Login)
