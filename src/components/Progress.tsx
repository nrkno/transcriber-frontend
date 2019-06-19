import * as React from "react"
import ReactGA from "react-ga"
import { ProgressType } from "../enums"
import { ITranscript } from "../interfaces"
import {functions} from "../firebaseApp";

interface IProps {
  transcript: ITranscript
}

class Progress extends React.Component<IProps, any> {
  public render() {
    const transcript = this.props.transcript

    if (transcript === undefined || transcript.status === undefined || transcript.status.progress === ProgressType.Done) {
      return null
    }

    const progress = transcript.status.progress
    let statusLastUpdated = " "
    if (transcript.status && transcript.status.lastUpdated) {
      statusLastUpdated = transcript.status.lastUpdated.toDate().toLocaleString()
    }

    return (
      <main id="transcript">
        <section className="org-bar">
          <span className="org-text-l">{transcript.name}</span>
          <span>Automatic update enabled. LastUpdated: {statusLastUpdated}</span>
        </section>

        <div>
          {(() => {
            if (transcript.status.error) {
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
            Analyserer:
            {(() => {
              if (progress === ProgressType.Analysing) {
                if (transcript.status.error) {
                  return (
                    <div>
                      <progress data-status="error" className="org-progress" value="1" max="100" /> <div className="org-color-error"> {transcript.status.error.message}</div>
                    </div>
                  )
                } else {
                  return <progress className="org-progress" />
                }
              } else if (progress === ProgressType.Uploading) {
                return <progress className="org-progress" value="0" max="100" />
              } else {
                return <progress data-status="completed" className="org-progress" value="100" max="100" />
              }
            })()}
          </label>

          <label className="org-label">
            Transkribering:
            {(() => {
              if (progress === ProgressType.Transcribing) {
                if (transcript.status.error) {
                  return <progress data-status="error" className="org-progress" value={transcript.status.percent} max="100" />
                } else {
                  return <progress className="org-progress" value={transcript.status.percent} max="100" />
                }
              } else if (progress === ProgressType.Uploading || progress === ProgressType.Analysing) {
                return <progress className="org-progress" value="0" max="100" />
              } else {
                return <progress data-status="completed" className="org-progress" value="100" max="100" />
              }
            })()}
          </label>

          <label className="org-label">
            Lagring:
            {(() => {
              if (progress === ProgressType.Saving) {
                if (transcript.status.error) {
                  return <progress data-status="error" className="org-progress" value={transcript.status.percent} max="100" />
                } else {
                  return <progress className="org-progress" value={transcript.status.percent} max="100" />
                }
              } else if (progress === ProgressType.Uploading || progress === ProgressType.Analysing || progress === ProgressType.Transcribing) {
                return <progress className="org-progress" value="0" max="100" />
              } else {
                return <progress data-status="completed" className="org-progress" value="100" max="100" />
              }
            })()}
          </label>
        </div>
      </main>
    )
  }
}

export default Progress
