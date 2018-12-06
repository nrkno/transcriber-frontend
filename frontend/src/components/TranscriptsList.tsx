import moment from "moment"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import "../css/TranscriptsList.css"
import { Step } from "../enums"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import UploadButton from "./UploadButton"

interface IProps {
  userId?: string
  selectedTranscriptId?: string
  fileSelected: (file: File) => void
}

interface IState {
  transcripts?: ITranscript[]
  transcriptIds?: string[]
}

class TranscriptsList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    // Check if have the user in props
    if (this.props.userId !== undefined) {
      this.fetchTranscripts(this.props.userId)
    }
  }

  public componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.userId !== undefined && this.state.transcripts === undefined) {
      this.fetchTranscripts(this.props.userId)
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
              <th />
              <th>Navn</th>
              <th>Dato</th>
              <th>Varighet</th>
            </tr>
          </thead>
          <tbody>
            {this.state.transcripts &&
              this.state.transcripts.map((transcript, index) => {
                const createdAt = (transcript.createdAt as firebase.firestore.Timestamp).toDate()
                const formattedCreatedAt = moment(createdAt)
                  .locale("nb")
                  .calendar()
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
                              <use xlinkHref="#icon-x-c" />
                            </svg>
                          )
                        } else if (transcript.process && transcript.process.step !== Step.Done) {
                          return (
                            <svg width="20" height="20" focusable="false" aria-hidden="true">
                              <use xlinkHref="#icon-x-c" />
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
                    <td>
                      <Link to={`/transcripts/${id}`}>{transcript.name} </Link>
                    </td>
                    <td>{formattedCreatedAt}</td>
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

        <UploadButton fileSelected={this.props.fileSelected} />
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
