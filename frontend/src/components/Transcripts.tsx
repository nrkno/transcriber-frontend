import moment from "moment"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Status } from "../enums"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import Progress from "./Progress"
import Upload from "./Upload"

interface IProps {
  user?: firebase.User
}

interface IState {
  transcripts?: ITranscript[]
  transcriptIds?: string[]
}

class Transcripts extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    // Check if have the user in props
    if (this.props.user !== undefined) {
      this.fetchTranscripts(this.props.user.uid)
    }
  }

  public componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.user !== undefined && this.state.transcripts === undefined) {
      this.fetchTranscripts(this.props.user.uid)
    }
  }

  public render() {
    return (
      <main id="transcripts">
        <div className="transcripts">
          <h2 className="org-text-xl">Transkripsjoner</h2>

          {/* Render transcripts in progress */}
          {this.state.transcripts &&
            this.state.transcripts
              .filter(transcript => transcript.progress!.status !== Status.Success)
              .map((transcript, index) => {
                return <Progress transcript={transcript} key={index} />
              })}
          <table className="org-table">
            <thead>
              <tr>
                <th>Navn</th>
                <th>Dato</th>
                <th>Lengde</th>
              </tr>
            </thead>
            <tbody>
              {/* Inserting transcripts from Firestore */}
              {this.state.transcripts !== undefined &&
                this.state.transcriptIds !== undefined &&
                this.state.transcripts
                  .filter(transcript => transcript.progress.status === Status.Success)
                  .map((transcript, index) => {
                    const createdAt = (transcript.timestamps.createdAt as firebase.firestore.Timestamp).toDate()
                    const formattedCreatedAt = moment(createdAt)
                      .locale("nb")
                      .calendar()
                    const id = this.state.transcriptIds[index]
                    const duration = moment.duration(transcript.duration * 1000)

                    return (
                      <tr key={id}>
                        <td>
                          <Link to={`transcripts/${id}`}>{transcript.title} </Link>
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
        </div>

        <Upload user={this.props.user} />
      </main>
    )
  }

  private fetchTranscripts(uid: string) {
    database
      .collection("/transcripts")
      .where("userId", "==", uid)
      .orderBy("timestamps.createdAt", "desc")
      .onSnapshot(querySnapshot => {
        const transcripts = Array<ITranscript>()
        const transcriptIds = Array<string>()

        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          const transcript = doc.data() as ITranscript

          transcripts.push(transcript)

          // We only care about the ids of successful transcripts
          if (transcript.progress && transcript.progress.status === Status.Success) {
            transcriptIds.push(doc.id)
          }
        })

        this.setState({
          transcriptIds,
          transcripts,
        })
      })
  }
}

export default Transcripts
