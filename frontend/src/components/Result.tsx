import { flatten } from "lodash"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Status, SweetProgressStatus } from "../enums"
import firebaseApp from "../firebaseApp"
import { ITime, ITranscription } from "../interfaces"
import Player from "./Player"
import TranscriptionProgress from "./TranscriptionProgress"
import Word from "./Word"

interface IState {
  currentTime: number
  transcription?: ITranscription
}

class Result extends React.Component<RouteComponentProps<any>, IState> {
  private playerRef = React.createRef<Player>()
  constructor(props: any) {
    super(props)
    this.state = {
      currentTime: 0,
      transcription: undefined
    }
  }

  public componentDidMount() {
    firebaseApp.db
      .ref(`/transcripts/${this.props.match.params.id}`)
      .on("value", dataSnapshot => {
        if (dataSnapshot !== null) {
          this.setState({
            transcription: dataSnapshot.val()
          })
        }
      })
  }

  public handleTimeUpdate = (event: React.ChangeEvent<HTMLAudioElement>) => {
    this.setState({ currentTime: event.target.currentTime })
  }

  public setTime = (startTime: ITime) => {
    this.playerRef.current!.setTime(
      startTime.seconds ? Number(startTime.seconds) : 0
    )
  }

  public render() {
    const transcription = this.state.transcription

    // Loading from Firebase
    if (transcription === undefined) {
      return (
        <TranscriptionProgress
          message={"Last inn transkripsjon"}
          status={SweetProgressStatus.Active}
          symbol={"⏳"}
        />
      )
    }
    // Transcription not found
    else if (transcription === null) {
      return (
        <TranscriptionProgress
          message={"Fant ikke transkripsjonen"}
          status={SweetProgressStatus.Error}
        />
      )
    } else {
      const progress = transcription.progress!
      const error = transcription.error

      switch (progress.status) {
        case Status.Uploaded:
          // The file has been uploaded, and we're waiting for the Cloud function to start
          return (
            <TranscriptionProgress
              message={"Analyserer"}
              status={SweetProgressStatus.Active}
              symbol={"🔍"}
            />
          )

        case Status.Transcoding:
          return (
            <TranscriptionProgress
              message={"Transkoder"}
              status={SweetProgressStatus.Active}
              symbol={"🤖"}
            />
          )

        case Status.Transcribing:
          return (
            <TranscriptionProgress
              message={"Transkriberer"}
              status={SweetProgressStatus.Active}
              percent={progress.percent}
            />
          )

        case Status.Saving:
          return (
            <TranscriptionProgress
              message={"Lagrer transkripsjon"}
              percent={progress.percent}
            />
          )

        case Status.Success:
          // We have a transcription , show it

          const audioFile = transcription.audioFile
          const text = transcription.text!

          const words = flatten(Object.keys(text).map(key => text[key]))

          return (
            <div className="wrapper">
              <div className="result">
                <h2>{audioFile.name}</h2>
                <div className="nrk-color-spot warning">
                  ⚠️ NRK transkribering er i en tidlig utviklingsfase.
                  Transkriberingen er ikke noen fasit, og at kan ikke brukes
                  verbatim i f.eks. artikler el.l. uten at man har gått igjennom
                  teksten for hånd.
                </div>
                <p className="transcription">
                  {words.map((wordObject, i) => {
                    return (
                      <Word
                        key={i}
                        word={wordObject}
                        handleClick={this.setTime}
                        currentTime={this.state.currentTime}
                      />
                    )
                  })}
                </p>
                <Player
                  ref={this.playerRef}
                  fileUrl={audioFile.url}
                  handleTimeUpdate={this.handleTimeUpdate}
                />
              </div>
            </div>
          )

        case Status.Failed:
          return (
            <TranscriptionProgress
              message={error!.details}
              status={SweetProgressStatus.Error}
            />
          )

        default:
          return (
            <TranscriptionProgress
              message={"Noe gikk galt!"}
              status={SweetProgressStatus.Error}
            />
          )
      }
    }
  }
}

export default Result
