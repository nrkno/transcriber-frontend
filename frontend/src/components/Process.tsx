import * as React from "react"
import { Step } from "../enums"
import { ITranscript } from "../interfaces"

interface IProps {
  transcript: ITranscript
}

class Process extends React.Component<IProps, any> {
  public render() {
    const transcript = this.props.transcript

    if (transcript === undefined || transcript.process === undefined || transcript.process.step === Step.Done) {
      return null
    }

    const step = transcript.process.step

    return (
      <div>
        {(() => {
          if (transcript.process.error) {
            return (
              <div>
                <svg width="40" height="40" focusable="false" aria-hidden="true">
                  <use xlinkHref="#icon-x-c" color="red" />
                </svg>{" "}
                <span className="org-text-l">Noe gikk galt!</span>
              </div>
            )
          } else {
            return (
              <div>
                <svg width="40" height="40">
                  <defs>
                    <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <use xlinkHref="#icon-waveform" x="0" y="0" width="40" height="40" strokeWidth="0" stroke="none" />
                    </pattern>
                    <mask id="mask">
                      <rect x="0" y="0" width="40" height="40" fill="url(#pattern)">
                        <animate attributeName="x" from="-40" to="40" dur="1.5s" repeatCount="indefinite" />
                      </rect>
                    </mask>
                  </defs>
                  <rect x="0" y="0" width="40" fill="black" height="40" mask="url(#mask)" />
                </svg>{" "}
                <span className="org-text-l">Jobber</span>
              </div>
            )
          }
        })()}

        <label className="org-label">
          Transkoding:
          {(() => {
            if (step === Step.Transcoding) {
              if (transcript.process.error) {
                return (
                  <div>
                    <progress data-status="error" className="org-progress" value="1" max="100" /> <div className="org-color-error"> {transcript.process.error.message}</div>
                  </div>
                )
              } else {
                return <progress className="org-progress" />
              }
            } else if (step === Step.Uploading) {
              return <progress className="org-progress" value="0" max="100" />
            } else {
              return <progress data-status="completed" className="org-progress" value="100" max="100" />
            }
          })()}
        </label>

        <label className="org-label">
          Transkribering:
          {(() => {
            if (step === Step.Transcribing) {
              if (transcript.process.error) {
                return <progress data-status="error" className="org-progress" value={transcript.process.percent} max="100" />
              } else {
                return <progress className="org-progress" value={transcript.process.percent} max="100" />
              }
            } else if (step === Step.Uploading || step === Step.Transcoding) {
              return <progress className="org-progress" value="0" max="100" />
            } else {
              return <progress data-status="completed" className="org-progress" value="100" max="100" />
            }
          })()}
        </label>

        <label className="org-label">
          Lagring:
          {(() => {
            if (step === Step.Saving) {
              if (transcript.process.error) {
                return <progress data-status="error" className="org-progress" value={transcript.process.percent} max="100" />
              } else {
                return <progress className="org-progress" value={transcript.process.percent} max="100" />
              }
            } else if (step === Step.Uploading || step === Step.Transcoding || step === Step.Transcribing) {
              return <progress className="org-progress" value="0" max="100" />
            } else {
              return <progress data-status="completed" className="org-progress" value="100" max="100" />
            }
          })()}
        </label>
      </div>
    )
  }
}

export default Process
