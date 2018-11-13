import moment from "moment"
import React, { Component } from "react"
import Dropzone from "react-dropzone"
import { Link } from "react-router-dom"
import { Status } from "../enums"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import Progress from "./Progress"

interface IProps {
  user?: firebase.User
}

interface IState {
  transcripts?: ITranscript[]
  transcriptIds?: string[]
  modalIsOpen: boolean
}

class Transcripts extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { modalIsOpen: false }
  }
  public componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.user !== undefined && this.state.transcripts === undefined) {
      database
        .collection("/transcripts")
        .where("ownedBy", "==", this.props.user.uid)
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

          console.log(querySnapshot.docs)
        })
    }
  }

  public render() {
    return (
      <main id="transcripts">
        <div className="create">
          <h2 className="org-text-xl">Ny transkripsjon</h2>

          <Dropzone accept="audio/*" style={{ position: "relative", width: "100%", height: "100px", borderWidth: "2px", borderColor: "rgb(102, 102, 102)", borderStyle: "dashed", borderRadius: "5px" }}>
            <div
              style={{
                textAlign: "center",
                textJustify: "center",
              }}
            >
              Trykk for å velge, eller slipp lydfil her
            </div>
          </Dropzone>

          <form action="">
            <label className="org-label org-prs">
              Språk
              <select>
                <option selected={true}>Norsk</option>
                <option>Engelsk</option>
              </select>
            </label>
            <button className="org-btn org-btn--primary" disabled={this.state.file === undefined || this.props.user === undefined} type="submit">
              Last opp
            </button>
          </form>
        </div>

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
                    const createdAt = (transcript.createdAt as firebase.firestore.Timestamp).toDate()
                    const formattedCreatedAt = moment(createdAt)
                      .locale("nb")
                      .calendar()
                    const id = this.state.transcriptIds[index]
                    const duration = moment.duration(transcript.audio.duration * 1000)

                    return (
                      <tr key={id}>
                        <td>{transcript.title}</td>
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
      </main>
    )
  }
}

export default Transcripts
