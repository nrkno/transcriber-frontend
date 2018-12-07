import * as React from "react"
import ReactGA from "react-ga"
import { SweetProgressStatus } from "../enums"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import TranscriptionProgress from "./TranscriptionProgress"
import TranscriptResults from "./TranscriptResults"

interface IProps {
  transcript: ITranscript | null
  transcriptId: string
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
      return (
        <main id="loading">
          <TranscriptionProgress message={"Laster"} status={SweetProgressStatus.Active} symbol={"⏳"} />
        </main>
      )
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

 

      return (
        <>
          <main id="transcript">
            <div className="results">
              <div className="meta">
                <h1 className="org-text-xl">{transcript.name}</h1>
                <form onSubmit={this.handleExportToWord}>
                  <button className="org-btn" type="submit">
                    <svg width="20" height="20" focusable="false" aria-hidden="true">
                      <use xlinkHref="#icon-download" />
                    </svg>{" "}
                    Last ned som Word
                  </button>
                </form>
              </div>



            {{     this.state.tra   }}




              <TranscriptResults transcript={this.state.transcript} transcriptId={this.props.transcriptId} />
            </div>
          </main>
        </>
      )
    }
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
