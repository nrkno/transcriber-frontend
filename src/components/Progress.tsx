import * as React from "react"
import ReactGA from "react-ga"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router"
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
          <span>LastUpdated: {statusLastUpdated}</span>
          <button className="org-btn" onClick={() => this.handleUpdateButtonClicked(transcript)}>
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <g fill="none" fillRule="evenodd">
                <path d="M17 0H3a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3z" fill="#252627" />
                <text fontFamily="Roboto-Medium, Roboto" fontSize="15" fontWeight="400" fill="#FFF" transform="translate(0 -2)">
                  <tspan x="4.4" y="16">
                    u
                  </tspan>
                </text>
              </g>
            </svg>{" "}
            update
          </button>
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

  private handleUpdateButtonClicked = async (transcript: ITranscript) => {
    console.log("Transcript: ", transcript)
    if (transcript.id) {
      const transcriptId = transcript.id
      ReactGA.event({
        action: "update button pressed",
        category: "progress",
        label: transcriptId,
      })
      // const transcriptId = this.props.transcriptId
      const updateProgress = functions.httpsCallable("updateProgress")
      try {
        const result = await updateProgress({transcriptId})
        console.log("UpdateProgress result: ", result)
      } catch (error) {
        console.error(error)
        ReactGA.exception({
          description: error.message,
          fatal: false,
        })
      }
    } else {
      alert("Transcript has no id yet. Please try again later")
    }

  }
}

export default Progress
