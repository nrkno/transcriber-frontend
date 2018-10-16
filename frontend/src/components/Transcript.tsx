import { flatten } from "lodash"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Status, SweetProgressStatus } from "../enums"
import firebaseApp from "../firebaseApp"
import { ITime, ITranscription } from "../interfaces"
import Player from "./Player"
import TranscriptionProgress from "./TranscriptionProgress"
import Word from "./Word"
import ReactGA from "react-ga"

interface IState {
  currentTime: number
  transcription?: ITranscription
}

class Transcript extends React.Component<RouteComponentProps<any>, IState> {
  private playerRef = React.createRef<Player>()
  constructor(props: any) {
    super(props)
    this.state = {
      currentTime: 0,
      transcription: undefined,
    }
  }

  componentDidUpdate(/*prevProps, */ prevState: IState /*, snapshot*/) {
    if (this.state.transcription && this.state.transcription.progress && this.state.transcription.progress.status) {
      // Log errors
      if (this.state.transcription.progress.status === Status.Failed && this.state.transcription.error) {
        ReactGA.exception({
          description: this.state.transcription.error.message,
        })
      }
      // Logging progress status
      else if (
        prevState.transcription === undefined ||
        (prevState.transcription && prevState.transcription.progress && prevState.transcription.progress.status && prevState.transcription.progress.status !== this.state.transcription.progress.status)
      ) {
        ReactGA.event({
          category: "Progress",
          action: this.state.transcription.progress.status,
          nonInteraction: true,
        })
      }
    }
  }

  public componentDidMount() {
    firebaseApp.db.ref(`/transcripts/${this.props.match.params.id}`).on("value", dataSnapshot => {
      if (dataSnapshot !== null) {
        this.setState({
          transcription: dataSnapshot.val(),
        })
      }
    })
  }

  public handleTimeUpdate = (event: React.ChangeEvent<HTMLAudioElement>) => {
    this.setState({ currentTime: event.target.currentTime })
  }

  public setTime = (startTime: ITime) => {
    this.playerRef.current!.setTime(startTime.seconds ? Number(startTime.seconds) : 0)
  }

  public render() {
    const transcription = this.state.transcription

    // Loading from Firebase
    if (transcription === undefined) {
      return <TranscriptionProgress message={"Laster inn transkripsjon"} status={SweetProgressStatus.Active} symbol={"⏳"} />
    }
    // Transcription not found
    else if (transcription === null) {
      ReactGA.event({
        category: "Transcription",
        action: "Not found",
      })
      return <TranscriptionProgress message={"Fant ikke transkripsjonen"} status={SweetProgressStatus.Error} />
    } else {
      const progress = transcription.progress!

      switch (progress.status) {
        case Status.Analysing:
          // The file has been uploaded, and we're waiting for the Cloud function to start
          return <TranscriptionProgress message={"Analyserer"} status={SweetProgressStatus.Active} symbol={"🔍"} />

        case Status.Transcoding:
          return <TranscriptionProgress message={"Transkoder"} status={SweetProgressStatus.Active} symbol={"🤖"} />

        case Status.Transcribing:
          return <TranscriptionProgress message={"Transkriberer"} status={SweetProgressStatus.Active} percent={progress.percent} />

        case Status.Saving:
          return <TranscriptionProgress message={"Lagrer transkripsjon"} percent={progress.percent} />

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
                  ⚠️ Transkribering er i en tidlig utviklingsfase. Transkriberingen er ikke noen fasit, og at kan ikke brukes verbatim i f.eks. artikler el.l. uten at man har gått igjennom teksten for hånd.
                </div>
                <p className="transcription">
                  {words.map((wordObject, i) => {
                    return <Word key={i} word={wordObject} handleClick={this.setTime} currentTime={this.state.currentTime} />
                  })}
                </p>
                <Player ref={this.playerRef} fileUrl={audioFile.url} handleTimeUpdate={this.handleTimeUpdate} />
              </div>
            </div>
          )

        case Status.Failed:
          const error = transcription.error
          return <TranscriptionProgress message={error!.message} status={SweetProgressStatus.Error} />

        default:
          return <TranscriptionProgress message={"Noe gikk galt!"} status={SweetProgressStatus.Error} />
      }
    }
  }
}

export default Transcript
