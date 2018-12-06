import React, { Component } from "react"
import TranscriptsList from "./TranscriptsList"
import Upload from "./Upload"

interface IProps {
  user?: firebase.User
}

class Transcripts extends Component<IProps> {
  public render() {
    return (
      <main id="transcripts">
        {this.props.user ? (
          <>
            <TranscriptsList userId={this.props.user.uid} />
            <Upload user={this.props.user} />
          </>
        ) : (
          <div>Loading</div>
        )}
      </main>
    )
  }
}

export default Transcripts
