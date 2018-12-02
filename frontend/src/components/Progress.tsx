import * as React from "react"
import ReactGA from "react-ga"
import { Step, SweetProgressStatus } from "../enums"
import { ITranscript } from "../interfaces"
import TranscriptionProgress from "./TranscriptionProgress"

interface IProps {
  transcript: ITranscript
}

class Progress extends React.Component<IProps, any> {
  public render() {
    const transcript = this.props.transcript

    if (transcript === undefined || transcript.process === undefined || transcript.process.step === Step.Done) {
      return null
    }

    return (
      <div className="progress org-shadow-s org-color-shade">
        {(() => {
          const progress = transcript.process

          // Check for errors first

          const error = transcript.process.error
          if (error) {
            return <TranscriptionProgress message={error!.message} title={transcript.name} status={SweetProgressStatus.Error} />
          }

          // Else, show which step we are on

          switch (progress.step) {
            case Step.Uploading:
              // The file has been uploaded, and we're waiting for the Cloud function to start
              return <TranscriptionProgress message="Laster opp" title={transcript.name} status={SweetProgressStatus.Active} symbol={"⬆️"} />

            case Step.Transcoding:
              return <TranscriptionProgress message="Transkoder" title={transcript.name} status={SweetProgressStatus.Active} symbol={"🤖"} />

            case Step.Transcribing:
              return <TranscriptionProgress message="Transkriberer" title={transcript.name} status={SweetProgressStatus.Active} percent={progress.percent} />

            case Step.Saving:
              return <TranscriptionProgress message="Lagrer" title={transcript.name} status={SweetProgressStatus.Active} percent={progress.percent} />

            default:
              return <TranscriptionProgress message={"Noe gikk galt!"} title={transcript.name} status={SweetProgressStatus.Error} />
          }
        })()}
      </div>
    )
  }
}

export default Progress
