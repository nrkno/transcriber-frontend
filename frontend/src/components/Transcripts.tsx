import React, { Component } from "react"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router"
import { Dispatch } from "redux"
import { Step } from "../enums"
import { ITranscript } from "../interfaces"
import { selectTranscript } from "../store/actions/transcriptActions"
import CreateTranscript from "./CreateTranscript"
import Process from "./Process"
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
                if (this.props.transcripts !== undefined) {
                  const transcriptId = this.props.match.params.id

                  // Check status

                  const transcript: ITranscript = this.props.transcripts[transcriptId]

                  if (transcript === undefined) {
                    // Transcript not found
                    return <div>Fant ikke transkripsjon</div>
                  } else if (transcript.process && transcript.process.step && transcript.process.step !== Step.Done) {
                    return <Process transcript={transcript} />
                  }
                }
                return <Transcript transcriptId={this.props.match.params.id} history={this.props.history} />
              }

              return
            })()}
          </>
        ) : (
          ""
        )}
      </main>
    )
  }
  public handleFileSelected = (file: File) => {
    this.setState({ file })
  }

  public handleTranscriptIdSelected = (transcriptId: string) => {
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
