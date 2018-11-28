import React, { Component } from "react"
import { database } from "../firebaseApp"
import { ITranscripts } from "../interfaces"

interface IState {
  transcripts?: ITranscripts
}

class Statistics extends Component<any, IState> {
  constructor(props: any) {
    super(props)

    this.state = {
      transcripts: undefined,
    }
  }

  public render() {
    if (this.state.transcripts) {
      return (
        <div>
          Duration:
          {this.state.transcripts.duration}
          Words:
          {this.state.transcripts.numberOfWords}
          Number of transcripts:
          {this.state.transcripts.numberOfTranscripts}
        </div>
      )
    } else {
      return <div>STATS</div>
    }
  }

  public componentDidMount() {
    this.fetchStatistics()
  }

  private fetchStatistics() {
    database.doc("/statistics/transcripts").onSnapshot(documentSnapshot => {
      const transcripts = documentSnapshot.data() as ITranscripts

      this.setState({ transcripts })
    })
  }
}

export default Statistics
