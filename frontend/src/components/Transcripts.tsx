import React, { Component } from "react"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router"
import CreateTranscript from "./CreateTranscript"
import Transcript from "./Transcript"
import TranscriptsList from "./TranscriptsList"

interface IStateProps {
  user: firebase.User
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
    console.log("TRANSCIPRS", this.props.user)

    return (
      <main id="transcripts">
        {this.props.user.uid ? (
          <>
            <TranscriptsList userId={this.props.user.uid} selectedTranscriptId={this.props.match.params.id} handleFileSelected={this.handleFileSelected} handleTranscriptIdSelected={this.handleTranscriptIdSelected} />

            {(() => {
              if (this.state.file) {
                return <CreateTranscript file={this.state.file} userId={this.props.user.uid} transcriptCreated={this.transcriptCreated} />
              } else if (this.props.match.params.id) {
                return <Transcript transcriptId={this.props.match.params.id} history={this.props.history} />
              } else {
                return
              }
            })()}
          </>
        ) : (
          <div>Loading</div>
        )}
      </main>
    )
  }
  public handleFileSelected = (file: File) => {
    this.setState({ file })
  }

  public handleTranscriptIdSelected = async (transcriptId: string) => {
    this.props.history.push(`/transcripts/${transcriptId}`)
  }

  private transcriptCreated = (transcriptId: string) => {
    // Remove file so that Transcript is shown, and not CreateTranscript
    this.setState({ file: undefined })
    // Push the newly created transcript id
    this.props.history.push(`/transcripts/${transcriptId}`)
  }
}

const mapStateToProps = (state: State): IStateProps => {
  return {
    user: state.firebase.auth,
  }
}

export default connect(mapStateToProps)(Transcripts)
