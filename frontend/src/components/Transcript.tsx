import { flatten } from "lodash"
import * as React from "react"
import ReactGA from "react-ga"
import { RouteComponentProps } from "react-router"
import { Status, SweetProgressStatus } from "../enums"
import { database } from "../firebaseApp"
import { IResult, ITime, ITranscript } from "../interfaces"
import Player from "./Player"
import TranscriptionProgress from "./TranscriptionProgress"
import Word from "./Word"

interface IState {
  currentTime: number
  transcript?: ITranscript
}

class Transcript extends React.Component<RouteComponentProps<any>, IState> {
  private playerRef = React.createRef<Player>()
  constructor(props: any) {
    super(props)
    this.state = {
      currentTime: 0,
      transcript: undefined,
    }
  }
  public componentDidUpdate(_prevProps: any, prevState: IState /*, _snapshot*/) {
    if (this.state.transcript && this.state.transcript.progress && this.state.transcript.progress.status) {
      // Log errors
      if (this.state.transcript.progress.status === Status.Failed && this.state.transcript.error) {
        ReactGA.exception({
          description: this.state.transcript.error.message,
        })
      }

      /*FIXME
      // Logging progress status
      else if (prevState.transcript === undefined || (prevState.transcript && prevState.transcript.progress && prevState.transcript.progress.status && prevState.transcript.progress.status !== this.state.transcription.progress.status)) {
        ReactGA.event({
          action: this.state.transcript.progress.status,
          category: "Progress",
          nonInteraction: true,
        })
      }
      */
    }
  }

  public async componentDidMount() {
    database.doc(`users/aaaa/transcripts/${this.props.match.params.id}`).onSnapshot(documentSnapshot => {
      console.log(documentSnapshot)

      const transcript = documentSnapshot.data() as ITranscript

      this.setState({
        transcript,
      })
    })

    console.log(`users/aaaa/transcripts/${this.props.match.params.id}/results`)

    /*database.ref(`/transcripts/${this.props.match.params.id}`).on("value", async dataSnapshot => {
      if (dataSnapshot !== null) {
        this.setState({
          transcription: dataSnapshot.val(),
        })
      }
    })*/
  }

  public handleTimeUpdate = (event: React.ChangeEvent<HTMLAudioElement>) => {
    this.setState({ currentTime: event.target.currentTime })
  }

  public setTime = (startTime: ITime) => {
    this.playerRef.current!.setTime(startTime.seconds ? Number(startTime.seconds) : 0)
  }

  public render() {
    const transcription = this.state.transcript

    // Loading from Firebase
    if (transcription === undefined) {
      return <TranscriptionProgress message={"Laster inn transkripsjon"} status={SweetProgressStatus.Active} symbol={"⏳"} />
    }
    // Transcription not found
    else if (transcription === null) {
      ReactGA.event({
        action: "Not found",
        category: "Transcription",
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

          // Read results

          database
            .collection(`users/aaaa/transcripts/${this.props.match.params.id}/results`)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data())

                const result = doc.data() as IResult

                const words = result.words
              })
            })

          const results = transcription.results!

          console.log(results)

          const words = flatten(Object.keys(results).map(key => results[key]))

          return (
            <div className="wrapper">
              <div className="result">
                <h2>{transcription.name}</h2>
                <div className="nrk-color-spot warning">
                  ⚠️ Transkribering er i en tidlig utviklingsfase. Transkriberingen er ikke noen fasit, og at kan ikke brukes verbatim i f.eks. artikler el.l. uten at man har gått igjennom teksten for hånd.
                </div>
                <p className="transcription">
                  {words.map((wordObject, i) => {
                    return <Word key={i} word={wordObject} handleClick={this.setTime} currentTime={this.state.currentTime} />
                  })}
                </p>
                <Player ref={this.playerRef} fileUrl={transcription.url!} handleTimeUpdate={this.handleTimeUpdate} />
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
