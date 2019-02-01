import React, { Component } from "react"
import ReactGA from "react-ga"
import { auth } from "../firebaseApp"

interface IState {
  email: string
  password: string
}

class Login extends Component<any, IState> {
  constructor(props: any) {
    super(props)

    this.state = {
      email: "",
      password: "",
    }
  }

  public render() {
    return (
      <main id="transcript">
        <h1>Logg inn</h1>
        <form className="dropForm" onSubmit={this.handleSubmit}>
          <div>
            <label className="org-label">
              E-postadresse
              <textarea value={this.state.email} onChange={this.handleChangeEmail} />
            </label>
            <label className="org-label">
              Password
              <textarea value={this.state.password} onChange={this.handleChangePassword} />
            </label>
            <button className="org-btn org-btn--primary" disabled={this.submitButtonIsDisabled()} type="submit">
              Logg inn
            </button>
          </div>
        </form>
      </main>
    )
  }

  private submitButtonIsDisabled() {
    return this.state.email === "" || this.state.password === ""
  }

  private handleChangeEmail = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const email = event.target.value
    this.setState({ email })
  }

  private handleChangePassword = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const password = event.target.value
    this.setState({ password })
  }

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { email, password } = this.state

    try {
      await auth.signInWithEmailAndPassword(email, password)

      window.location.href = "/transcripts"
    } catch (error) {
      console.error(error)
      ReactGA.exception({
        description: error.message,
        fatal: false,
      })
    }
  }
}

export default Login
