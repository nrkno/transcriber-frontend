import * as React from "react"
import ReactGA from "react-ga"
import { Status, SweetProgressStatus } from "../enums"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import TranscriptionProgress from "./TranscriptionProgress"

interface IProps {
  transcript: ITranscript
}

class Progress extends React.Component<IProps, any> {
  public componentDidUpdate(_prevProps: any, prevState: any /*, _snapshot*/) {
    /* if (this.state.transcript && this.state.transcript.progress && this.state.transcript.progress.status) {
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
    */
  }

  public render() {
    const transcript = this.props.transcript

    if (transcript === undefined || transcript.progress === undefined || transcript.progress.status === Status.Success) {
      return null
    }

    return (
      <div className="progress org-shadow-s org-color-shade">
        {(() => {
          const progress = transcript.progress

          switch (progress.status) {
            case Status.Uploading:
              // The file has been uploaded, and we're waiting for the Cloud function to start
              return <TranscriptionProgress message="Laster opp" title={transcript.title} status={SweetProgressStatus.Active} symbol={"⬆️"} />

            case Status.Transcoding:
            case Status.Analysing:
              // The file has been uploaded, and we're waiting for the Cloud function to start
              return <TranscriptionProgress message="Analyserer" title={transcript.title} status={SweetProgressStatus.Active} symbol={"🔍"} />

            case Status.Transcoding:
              return <TranscriptionProgress message="Transkoder" title={transcript.title} status={SweetProgressStatus.Active} symbol={"🤖"} />

            case Status.Transcribing:
              return <TranscriptionProgress message="Transkriberer" title={transcript.title} status={SweetProgressStatus.Active} percent={progress.percent} />

            case Status.Saving:
              return <TranscriptionProgress message="Lagrer" title={transcript.title} status={SweetProgressStatus.Active} percent={progress.percent} />

            case Status.Failed:
              const error = transcript.error
              return <TranscriptionProgress message={error!.message} title={transcript.title} status={SweetProgressStatus.Error} />

            default:
              return <TranscriptionProgress message={"Noe gikk galt!"} title={transcript.title} status={SweetProgressStatus.Error} />
          }
        })()}
      </div>
    )
  }
}

export default Progress
