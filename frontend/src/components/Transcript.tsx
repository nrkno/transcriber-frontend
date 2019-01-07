import * as React from "react"
import ReactGA from "react-ga"
import { Step, SweetProgressStatus } from "../enums"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import Process from "./Process"
import TranscriptionProgress from "./TranscriptionProgress"
import TranscriptResults from "./TranscriptResults"

interface IProps {
  transcript: ITranscript | null
  transcriptId: string
}

interface IState {
  transcript?: ITranscript | null
}

class Transcript extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      transcript: null,
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.transcriptId !== prevProps.transcriptId) {
      this.fetchTranscript(this.props.transcriptId)
    }
  }

  public async componentDidMount() {
    this.fetchTranscript(this.props.transcriptId)
  }

  public render() {
    const transcript = this.state.transcript

    // Loading from Firebase
    if (transcript === null) {
      return null
    }
    // Transcription not found
    else if (transcript === undefined) {
      ReactGA.event({
        action: "transcript not found",
        category: "transcript",
        label: this.props.transcriptId,
      })
      return (
        <main id="loading">
          <TranscriptionProgress message={"Fant ikke transkripsjonen"} status={SweetProgressStatus.Error} />
        </main>
      )
    } else {
      // Check current step

      const isDone = transcript && transcript.process && transcript.process.step === Step.Done ? true : false

      return (
        <main id="transcript">
          <div className="meta">
            <h1 className="org-text-xl">{transcript.name}</h1>

            {(() => {
              if (isDone) {
                return (
                  <form onSubmit={this.handleExportToWord}>
                    <button className="org-btn org-btn--primary" type="submit">
                      <svg width="20" height="20" focusable="false" aria-hidden="true">
                        <use xlinkHref="#icon-download" />
                      </svg>{" "}
                      Last ned som Word
                    </button>
                  </form>
                )
              } else {
                return
              }
            })()}
          </div>
          {(() => {
            if (isDone) {
              return (
                <div className="results">
                  <TranscriptResults transcript={transcript} transcriptId={this.props.transcriptId} />
                </div>
              )
            } else {
              return <Process transcript={transcript} />
            }
          })()}
        </main>
      )
    }
  }
  private fetchTranscript(transcriptId: string) {
    database.doc(`transcripts/${transcriptId}`).onSnapshot(
      documentSnapshot => {
        const transcript = documentSnapshot.data() as ITranscript

        this.setState({
          transcript,
        })
      },
      error => {
        console.log("error", error)

        this.setState({
          transcript: undefined,
        })
      },
    )
  }

  private handleExportToWord = async (event: React.FormEvent<HTMLFormElement>) => {
    ReactGA.event({
      action: "export button pressed",
      category: "transcript",
      label: "docx",
    })

    event.preventDefault()

    const id = this.props.transcriptId

    window.location.href = `${process.env.REACT_APP_FIREBASE_HTTP_CLOUD_FUNCTION_URL}/exportToDoc?id=${id}`
  }
}

export default Transcript
