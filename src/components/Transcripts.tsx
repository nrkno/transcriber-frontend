import React, { Component } from "react"
import ReactGA from "react-ga"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router"
import { Dispatch } from "redux"
import { ProgressType } from "../enums"
import { ITranscript } from "../interfaces"
import { selectTranscript } from "../store/actions/transcriptActions"
import CreateTranscript from "./CreateTranscript"
import FileTypeErrorModalWindow from "./FileTypeErrorModalWindow"
import Progress from "./Progress"
import Transcript from "./Transcript"
import TranscriptsList from "./TranscriptsList"

interface IStateProps {
  transcripts: ITranscript[]
  user: firebase.User
}

interface IProps {
  history: History
}

interface IState {
  file?: File
  hasFileTypeError: boolean
}

class Transcripts extends Component<RouteComponentProps<{}> & IStateProps, IState> {
  public readonly state: IState = {
    hasFileTypeError: false,
  }

  public render() {
    return (
      <main id="transcripts">
        {this.props.user.uid ? (
          <>
            {this.state.hasFileTypeError && <FileTypeErrorModalWindow hideErrorMessage={this.hideFileTypeErrorMessage} />}
            <TranscriptsList
              userId={this.props.user.uid}
              selectedTranscriptId={this.props.match.params.id}
              handleFileSelected={this.handleFileSelected}
              handleTranscriptIdSelected={this.handleTranscriptIdSelected}
              showFileTypeErrorMessage={this.showFileTypeErrorMessage}
            />

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
                    ReactGA.event({
                      action: "not found",
                      category: "transcript",
                      label: this.props.transcriptId,
                    })
                    return <div>Fant ikke transkripsjon</div>
                  } else if (transcript.status && transcript.status.progress && transcript.status.progress !== ProgressType.Done) {
                    return <Progress transcript={transcript} transcriptId={this.props.match.params.id} history={this.props.history} />
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

  public showFileTypeErrorMessage = () => this.setState({ hasFileTypeError: true })

  public hideFileTypeErrorMessage = () => this.setState({ hasFileTypeError: false })

  private transcriptCreated = (transcriptId: string) => {
    // Push the newly created transcript id
    this.props.history.push(`/transcripts/${transcriptId}`)
    // Remove file so that Transcript is shown, and not CreateTranscript
    this.setState({ file: undefined })
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
