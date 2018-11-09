import React, { Component } from "react"
import { Link } from "react-router-dom"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"

interface IProps {
  user?: firebase.User
}

interface IState {
  transcripts?: ITranscript[]
  ids?: string[]
}

class Transcripts extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }
  public componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.user !== undefined && this.state.transcripts === undefined) {
      database
        .collection("/transcripts")
        .where("ownedBy", "==", this.props.user.uid)
        .get()
        .then(querySnapshot => {
          const transcripts = Array<ITranscript>()
          const ids = Array<string>()

          querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            const transcript = doc.data() as ITranscript

            transcripts.push(transcript)
            ids.push(doc.id)
          })

          this.setState({
            ids,
            transcripts,
          })

          console.log(querySnapshot.docs)
        })
    }
  }

  public render() {
    return (
      <main id="transcripts">
        <div className="transcripts">
          {this.state.transcripts !== undefined &&
            this.state.ids !== undefined &&
            this.state.transcripts.map((transcript, index) => {
              const createdAt = (transcript.createdAt as firebase.firestore.Timestamp).toDate()
              const formattedCreatedAt = createdAt.toLocaleDateString() + " " + createdAt.toLocaleTimeString()
              const id = this.state.ids[index]

              return (
                <div className="transcript org-shadow-m" key={id}>
                  <Link to={`/transcripts/${id}`}>
                    <h2 className="title org-text-l">{transcript.title}</h2>

                    <div className="meta">
                      <div className="date org-label small">
                        <svg width="20" height="20" focusable="false" aria-hidden="true">
                          <use xlinkHref={"#icon-calendar-blank"} />
                        </svg>{" "}
                        {formattedCreatedAt}
                      </div>

                      <div className="duration org-label small">
                        <svg width="20" height="20" focusable="false" aria-hidden="true">
                          <use xlinkHref={"#icon-klokke"} />
                        </svg>
                        {transcript.audio.duration}
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
        </div>
      </main>
    )
  }
}

export default Transcripts
