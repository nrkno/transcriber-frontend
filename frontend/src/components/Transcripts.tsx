import React, { Component } from "react"
import ReactGA from "react-ga"
import { RouteComponentProps } from "react-router"
import { functions } from "../firebaseApp"
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
    // Check if a file has been selected,
    // meaning that we need to warn the user that
    // the upload will be lost

    if (this.state.file !== undefined && window.confirm("Ønsker du å avbryte transkripsjonsjobben?")) {
      this.setState({ file: undefined })

      /*const deleteTranscript = functions.httpsCallable("deleteTranscript")
      try {
        await deleteTranscript({ transcriptId })
      } catch (error) {
        console.error(error)
        ReactGA.exception({
          description: error.message,
          fatal: false,
        })
      }*/

      ReactGA.event({
        action: "aborted",
        category: "transcript",
      })
    }

    if (this.state.file === undefined) {
      this.props.history.push(`/transcripts/${transcriptId}`)
    }
  }

  private transcriptCreated = (transcriptId: string) => {
    // Remove file so that Transcript is shown, and not CreateTranscript
    this.setState({ file: undefined })
    // Push the newly created transcript id
    this.props.history.push(`/transcripts/${transcriptId}`)
  }
}

export default Transcripts
