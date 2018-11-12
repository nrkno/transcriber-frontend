import * as React from "react"
import ReactGA from "react-ga"
import { Status, SweetProgressStatus } from "../enums"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import TranscriptionProgress from "./TranscriptionProgress"

interface IState {
  transcript?: ITranscript
}

interface IProps {
  id: string
}

class InProgress extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      transcript: undefined,
    }
  }
  public componentDidUpdate(_prevProps: any, prevState: IState /*, _snapshot*/) {
    if (this.state.transcript && this.state.transcript.progress && this.state.transcript.progress.status) {
      // Log errors
      if (this.state.transcript.progress.status === Status.Failed && this.state.transcript.error) {
        ReactGA.exception({
          description: this.state.transcript.error.message,
        })
      }

      // Logging progress status
      else if (prevState.transcript === undefined || (prevState.transcript && prevState.transcript.progress && prevState.transcript.progress.status && prevState.transcript.progress.status !== this.state.transcript.progress.status)) {
        ReactGA.event({
          action: this.state.transcript.progress.status,
          category: "Progress",
          nonInteraction: true,
        })
      }
    }
  }

  public async componentDidMount() {
    database.doc(`transcripts/${this.props.id}`).onSnapshot(documentSnapshot => {
      const transcript = documentSnapshot.data() as ITranscript

      this.setState({
        transcript,
      })
    })
  }

  public render() {
    const transcript = this.state.transcript

    // Loading from Firebase
    if (transcript === undefined) {
      return <TranscriptionProgress message={"Laster inn"} status={SweetProgressStatus.Active} symbol={"⏳"} />
    } else {
      const progress = transcript.progress!

      switch (progress.status) {
        case Status.Analysing:
          // The file has been uploaded, and we're waiting for the Cloud function to start
          return <TranscriptionProgress message={`Analyserer ${transcript.title}`} status={SweetProgressStatus.Active} symbol={"🔍"} />

        case Status.Transcoding:
          return <TranscriptionProgress message={`Transkoder ${transcript.title}`} status={SweetProgressStatus.Active} symbol={"🤖"} />

        case Status.Transcribing:
          return <TranscriptionProgress message={`Transkriberer ${transcript.title}`} status={SweetProgressStatus.Active} percent={progress.percent} />

        case Status.Saving:
          return <TranscriptionProgress message={`Lagrer ${transcript.title}`} percent={progress.percent} />

        case Status.Success:
          // We have a transcription , show it

          // Read results

          return "SUCCESS"

        case Status.Failed:
          const error = transcript.error
          return <TranscriptionProgress message={error!.message} status={SweetProgressStatus.Error} />

        default:
          return <TranscriptionProgress message={"Noe gikk galt!"} status={SweetProgressStatus.Error} />
      }
    }
  }
}

export default InProgress
