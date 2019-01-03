import moment from "moment"
import React, { Component } from "react"
import { RouteComponentProps } from "react-router"
import { Link } from "react-router-dom"
import "../css/TranscriptsList.css"
import { Step } from "../enums"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import UploadButton from "./UploadButton"

interface IProps {
  fileSelected: (file: File) => void
  history: History
  selectedTranscriptId?: string
  userId: string
}

interface IState {
  transcripts?: ITranscript[]
  transcriptIds?: string[]
}

class TranscriptsList extends Component<RouteComponentProps<{}> & IProps, IState> {
  constructor(props: RouteComponentProps<{}> & IProps) {
    super(props)
    this.state = {}
    console.log("PROPS", props)
    console.log("PROPS HIS", props.history)
  }

  public componentDidMount() {
    this.fetchTranscripts(this.props.userId)
  }

  public componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.userId !== undefined && this.state.transcripts === undefined) {
      this.fetchTranscripts(this.props.userId)
    }

    if (this.props.selectedTranscriptId === undefined && this.state.transcriptIds) {
      // If selectedTranscriptId is undefined, it means that the user is accessing /transcripts
      // We should thus select the newest transcript from the list

      console.log(this.props)

      this.props.history.push(`/transcripts/${this.state.transcriptIds[0]}`)
    }
  }

  public render() {
    console.log("RENDER!!!")

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
            {this.state.transcripts &&
              this.state.transcripts.map((transcript, index) => {
                let createdAt: string

                if (transcript.createdAt !== null) {
                  const date = (transcript.createdAt as firebase.firestore.Timestamp).toDate()

                  createdAt = moment(date)
                    .locale("nb")
                    .calendar()
                } else {
                  createdAt = ""
                }

                const id = this.state.transcriptIds[index]
                const duration = moment.duration(transcript.metadata.audioDuration * 1000)

                let className = "trans-item"
                if (id === this.props.selectedTranscriptId) {
                  className += " trans-item--selected"
                }
                if (transcript.process && transcript.process.error) {
                  className += " org-color-error"
                }

                return (
                  <tr key={id} className={className}>
                    <td>
                      {(() => {
                        if (transcript.process && transcript.process.error) {
                          return (
                            <svg width="20" height="20" focusable="false" aria-hidden="true">
                              <use xlinkHref="#icon-warning" />
                            </svg>
                          )
                        } else if (transcript.process && transcript.process.step !== Step.Done) {
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
                    <td className="name">
                      <Link to={`/transcripts/${id}`}>{transcript.name} </Link>
                    </td>
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

        <UploadButton fileSelected={this.props.fileSelected} userId={this.props.userId} />
      </div>
    )
  }

  private fetchTranscripts(userId: string) {
    database
      .collection("/transcripts")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .onSnapshot(querySnapshot => {
        const transcripts = Array<ITranscript>()
        const transcriptIds = Array<string>()

        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          const transcript = doc.data() as ITranscript

          transcripts.push(transcript)
          transcriptIds.push(doc.id)
        })

        this.setState({
          transcriptIds,
          transcripts,
        })
      })
  }
}

export default TranscriptsList
