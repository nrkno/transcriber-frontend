import * as React from "react"
import ReactGA from "react-ga"
import { RouteComponentProps } from "react-router"
import { Status, SweetProgressStatus } from "../enums"
import { database } from "../firebaseApp"
import { ITime, ITranscription } from "../interfaces"
import Player from "./Player"
import TranscriptionProgress from "./TranscriptionProgress"
import Word from "./Word"

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
  public componentDidUpdate(_prevProps: any, prevState: IState /*, _snapshot*/) {
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
    database.ref(`/transcripts/${this.props.match.params.id}`).on("value", async dataSnapshot => {
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

          return (
            <>
              <main>
                <h2>{audioFile.name}</h2>
                <div className="results">
                  {Object.values(text).map((result, i) => {
                    let seconds = 0

                    if (result[0].startTime && result[0].startTime.seconds) {
                      seconds = parseInt(result[0].startTime.seconds, 10)
                    }

                    const startTime = new Date(seconds * 1000).toISOString().substr(11, 8)

                    return (
                      <>
                        <div className="startTime">{startTime}</div>

                        <div key={i} className="result">
                          {Object.values(result).map((wordObject, j) => {
                            {
                              return <Word key={j} word={wordObject} handleClick={this.setTime} currentTime={this.state.currentTime} />
                            }
                          })}
                        </div>
                      </>
                    )
                  })}
                </div>
              </main>
              <Player ref={this.playerRef} fileUrl={audioFile.url} handleTimeUpdate={this.handleTimeUpdate} />
            </>
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
