import React, { Component } from "react"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router"
import { Dispatch } from "redux"
import { ITranscript } from "../interfaces"
import { selectTranscript } from "../store/actions/transcriptActions"
import CreateTranscript from "./CreateTranscript"
import Transcript from "./Transcript"
import TranscriptsList from "./TranscriptsList"

interface IStateProps {
  transcripts: ITranscript[]
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

  public handleTranscriptIdSelected = (transcriptId: string) => {
    console.log("PUSher")

    this.props.history.push(`/transcripts/${transcriptId}`)

    // const transcript = this.props.transcripts[transcriptId]

    // this.props.selectTranscript(transcriptId /*, transcript*/)
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
    transcripts: state.firestore.data.transcripts,
    user: state.firebase.auth,
  }
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  return {
    selectTranscript: (transcriptId: string) => dispatch(selectTranscript(transcriptId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Transcripts)
