import moment from "moment"
import React, { Component } from "react"
import { connect } from "react-redux"
import { firestoreConnect } from "react-redux-firebase"
import { compose } from "redux"
import "../css/TranscriptsList.css"
import { ProgressType } from "../enums"
import { ITranscript } from "../interfaces"
import UploadButton from "./UploadButton"

interface IProps {
  handleFileSelected: (file: File) => void
  handleTranscriptIdSelected: (transcriptId: string) => void
  selectedTranscriptId?: string
  userId: string
  showFileTypeErrorMessage: () => void
}

class TranscriptsList extends Component<IProps> {
  public componentDidUpdate(prevProps) {
    if (prevProps.transcripts === undefined && this.props.transcripts !== undefined && this.props.selectedTranscriptId !== undefined) {
      // Transcripts are loaded for the first time, select from URL

      this.props.handleTranscriptIdSelected(this.props.selectedTranscriptId)
    }
  }

  public render() {
    return (
      <div className="trans-list org-color-shade org-shadow-l org-color-base">
        <div className="org-bar">
          <h2 className="org-text-l">Transkripsjoner</h2>
        </div>
        <hr />
        <table className="org-table">
          <thead>
            <tr>
              <th className="icon" />
              <th className="name">Navn</th>
              <th className="date">Dato</th>
              <th>Varighet</th>
            </tr>
          </thead>
          <tbody>
            {this.props.transcripts &&
              this.props.transcripts.map((transcript: ITranscript) => {
                let createdAt: string

                if (transcript.createdAt !== null) {
                  const date = (transcript.createdAt as firebase.firestore.Timestamp).toDate()

                  createdAt = moment(date)
                    .locale("nb")
                    .calendar()
                } else {
                  createdAt = ""
                }

                const transcriptId = transcript.id
                const duration = moment.duration(transcript.metadata.audioDuration * 1000)

                let className = "trans-item"
                if (transcriptId === this.props.selectedTranscriptId) {
                  className += " trans-item--selected"
                }
                if (transcript.status && transcript.status.error) {
                  className += " org-color-error"
                }

                return (
                  <tr key={transcriptId} data-transcript-id={transcriptId} className={className} onClick={this.handleRowClick}>
                    <td>
                      {(() => {
                        if (transcript.status && transcript.status.error) {
                          return (
                            <svg width="20" height="20" focusable="false" aria-hidden="true">
                              <use xlinkHref="#icon-warning" />
                            </svg>
                          )
                        } else if (transcript.status && transcript.status.progress !== ProgressType.Done) {
                          return (
                            <svg width="20" height="20">
                              <defs>
                                <pattern id="pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                                  <use xlinkHref="#icon-waveform" x="0" y="0" width="20" height="20" strokeWidth="0" stroke="none" />
                                </pattern>
                                <mask id="mask">
                                  <rect x="0" y="0" width="20" height="20" fill="url(#pattern)">
                                    <animate attributeName="x" from="-20" to="20" dur="1.5s" repeatCount="indefinite" />
                                  </rect>
                                </mask>
                              </defs>
                              <rect x="0" y="0" width="20" fill="black" height="20" mask="url(#mask)" />
                            </svg>
                          )
                        } else {
                          return (
                            <svg width="20" height="20" focusable="false" aria-hidden="true">
                              <use xlinkHref="#icon-title" />
                            </svg>
                          )
                        }
                      })()}
                    </td>
                    <td className="name">{transcript.name}</td>
                    <td>{createdAt}</td>
                    <td>
                      {duration.hours() > 0 ? `${duration.hours()} t ` : ""}
                      {duration.minutes() > 0 ? `${duration.minutes()} m` : ""}
                      {duration.hours() === 0 && duration.minutes() === 0 ? `${duration.seconds()} s` : ""}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>

        <UploadButton
          fileSelected={this.props.handleFileSelected}
          userId={this.props.userId}
          showFileTypeErrorMessage={this.props.showFileTypeErrorMessage}
        />
      </div>
    )
  }

  private handleRowClick = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    const transcriptId = event.currentTarget.dataset.transcriptId

    if (transcriptId !== undefined && transcriptId !== this.props.selectedTranscriptId) {
      this.props.handleTranscriptIdSelected(transcriptId)
    }
  }
}

export default compose(
  connect(state => ({
    auth: state.firebase.auth,
  })),
  firestoreConnect(props => [
    {
      collection: "transcripts",
      orderBy: ["createdAt", "desc"],
      where: ["userId", "==", props.auth.uid],
      //      where: ["userIds", "array-contains", props.auth.uid],
    },
  ]),
  connect(state => ({
    transcripts: state.firestore.ordered.transcripts,
  })),
)(TranscriptsList)
