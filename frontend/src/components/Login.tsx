import React, { Component } from "react"
import ReactGA from "react-ga"
import { RouteComponentProps, withRouter } from "react-router"

interface IProps {
  user?: firebase.User
  logout: () => void
}

class Login extends Component<RouteComponentProps<{}> & IProps, any> {
  public render() {
    return (
      <div className="user">
        {(() => {
          if (this.props.user) {
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

    try {
      this.props.history.push("/")
      this.props.logout()
    } catch (error) {
      console.error(error)
    }
  }
}

export default withRouter(Login)
