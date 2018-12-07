import React, { Component } from "react"
import { RouteComponentProps } from "react-router"
import CreateTranscript from "./CreateTranscript"
import Transcript from "./Transcript"
import TranscriptsList from "./TranscriptsList"

interface IProps {
  user?: firebase.User
}

interface IState {
  file?: File
}

class Transcripts extends Component<RouteComponentProps<{}> & IProps, IState> {
  constructor(props: RouteComponentProps<{}> & IProps) {
    super(props)
    this.state = {}
  }

  public render() {
    return (
      <main id="transcripts">
        {this.props.user ? (
          <>
            <TranscriptsList userId={this.props.user.uid} selectedTranscriptId={this.props.match.params.id} fileSelected={this.fileSelected} history={this.props.history} />

            {this.state.file ? <CreateTranscript file={this.state.file} userId={this.props.user.uid} /> : <Transcript transcriptId={this.props.match.params.id} />}
          </>
        ) : (
          <div>Loading</div>
        )}
      </main>
    )
  }
  public fileSelected = (file: File) => {
    this.setState({ file })
  }
}

export default Transcripts
