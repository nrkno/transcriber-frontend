import * as React from "react"
import ReactGA from "react-ga"
import { RouteComponentProps } from "react-router"
import { Step, SweetProgressStatus } from "../enums"
import { database, functions } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import Process from "./Process"
import TranscriptionProgress from "./TranscriptionProgress"
import TranscriptResults from "./TranscriptResults"

interface IProps {
  history: History
  transcript: ITranscript | null
  transcriptId?: string
}

interface IState {
  transcript?: ITranscript | null
}

class Transcript extends React.Component<RouteComponentProps<{}> & IProps, IState> {
  private unsubscribe: () => void

  constructor(props: any) {
    super(props)
    this.state = {
      transcript: null,
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.transcriptId && this.props.transcriptId !== prevProps.transcriptId) {
      this.fetchTranscript(this.props.transcriptId)
    }
  }

  public componentWillUnmount() {
    this.unsubscribe()
  }

  public componentDidMount() {
    if (this.props.transcriptId) {
      this.fetchTranscript(this.props.transcriptId)
    }
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
          <section className="org-bar">
            <span className="org-text-l">{transcript.name}</span>

            {(() => {
              if (isDone) {
                return (
                  <>
                    <button className="org-btn" onClick={() => this.handleExportTranscriptButtonClicked("docx")}>
                      <svg width="20" height="20" focusable="false" aria-hidden="true">
                        <use xlinkHref="#icon-download" />
                      </svg>{" "}
                      docx
                    </button>

                    <button className="org-btn" onClick={() => this.handleExportTranscriptButtonClicked("xmp")}>
                      <svg width="20" height="20" focusable="false" aria-hidden="true">
                        <use xlinkHref="#icon-download" />
                      </svg>{" "}
                      xmp
                    </button>
                    <button className="org-btn" onClick={this.handleDeleteButtonClicked}>
                      <svg width="20" height="20" focusable="false" aria-hidden="true">
                        <use xlinkHref="#icon-garbage" />
                      </svg>{" "}
                      Slett
                    </button>
                  </>
                )
              } else {
                return
              }
            })()}
          </section>

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
    this.unsubscribe = database.doc(`transcripts/${transcriptId}`).onSnapshot(
      documentSnapshot => {
        const transcript = documentSnapshot.data() as ITranscript

        this.setState({
          transcript,
        })
      },
      error => {
        console.error(error)

        this.setState({
          transcript: undefined,
        })
      },
    )
  }

  private handleExportTranscriptButtonClicked = (type: string) => {
    ReactGA.event({
      action: "export button pressed",
      category: "transcript",
      label: type,
    })

    const id = this.props.transcriptId

    window.location.href = `${process.env.REACT_APP_FIREBASE_HTTP_CLOUD_FUNCTION_URL}/exportTranscript?id=${id}&type=${type}`
  }

  private handleDeleteButtonClicked = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ReactGA.event({
      action: "delete button pressed",
      category: "transcript",
    })

    const transcriptId = this.props.transcriptId
    const deleteTranscript = functions.httpsCallable("deleteTranscript")

    try {
      this.props.history.push("/transcripts/")
      await deleteTranscript({ transcriptId })
    } catch (error) {
      console.error(error)
      ReactGA.exception({
        description: error.message,
        fatal: false,
      })
    }
  }
}

export default Transcript
