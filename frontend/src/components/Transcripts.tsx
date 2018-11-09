import React, { Component } from "react"
import { database } from "../firebaseApp"
import { ITranscript } from "../interfaces"

interface IProps {
  user?: firebase.User
}

interface IState {
  transcripts?: ITranscript[]
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

          querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            const transcript = doc.data() as ITranscript

            transcripts.push(transcript)

            console.log(doc.id, " => ", doc.data())
          })

          this.setState({
            transcripts,
          })

          console.log(querySnapshot.docs)
        })
    }
  }

  public render() {
    console.log("this.state.transcripts")
    console.log(this.state.transcripts)

    return (
      <div>
        Transckrips
        <ul>
          {this.state.transcripts !== undefined &&
            this.state.transcripts.map(transcript => {
              return (
                <li>
                  <a href="">{transcript.title}</a>
                </li>
              )
            })}
        </ul>
      </div>
    )
  }
}

export default Transcripts
