import React, { Component } from "react"
import { RouteComponentProps } from "react-router"
import Transcript from "./Transcript"
import TranscriptsList from "./TranscriptsList"
import Upload from "./Upload"

interface IProps {
  user?: firebase.User
}

class Transcripts extends Component<RouteComponentProps<IProps>, any> {
  public render() {
    return (
      <main id="transcripts">
        {this.props.user ? (
          <>
            <TranscriptsList userId={this.props.user.uid} selectedTranscriptId={this.props.match.params.id} />
            {/*<Upload user={this.props.user} />*/}
            <Transcript transcriptId={this.props.match.params.id} />
          </>
        ) : (
          <div>Loading</div>
        )}
      </main>
    )
  }
}

export default Transcripts
