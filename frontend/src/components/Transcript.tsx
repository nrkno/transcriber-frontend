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
  currentResult: number | undefined
  currentTime: number
  currentWord: number | undefined
  transcript?: ITranscript
}

class Transcript extends React.Component<RouteComponentProps<any>, IState> {
  private playerRef = React.createRef<Player>()
  constructor(props: any) {
    super(props)
    this.state = {
      currentResult: undefined,
      currentTime: 0,
      currentWord: undefined,
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

      // Logging progress status
      else if (prevState.transcript === undefined || (prevState.transcript && prevState.transcript.progress && prevState.transcript.progress.status && prevState.transcript.progress.status !== this.state.transcript.progress.status)) {
        ReactGA.event({
          action: this.state.transcript.progress.status,
          category: "Progress",
          nonInteraction: true,
        })
      }
    }
  }

  public async componentDidMount() {
    database.doc(`transcripts/${this.props.match.params.id}`).onSnapshot(documentSnapshot => {
      console.log(documentSnapshot)

      const transcript = documentSnapshot.data() as ITranscript

      this.setState({
        transcript,
      })
    })
  }

  public handleTimeUpdate = (event: React.ChangeEvent<HTMLAudioElement>) => {
    // Find the next current result and word

    if (this.state.transcript === undefined || this.state.transcript.results === undefined) {
      return
    }

    const { results } = this.state.transcript
    const currentTime = event.target.currentTime
    console.log(currentTime)

    let i
    loop: for (i = this.state.currentResult || 0; i < results.length; i++) {
      console.log(`-----------`)
      console.log(`result ${i}`)

      const words = results[i].words
      let j
      for (j = this.state.currentWord || 0; j < words.length; j++) {
        console.log(`word ${j}`)
        const word = words[j]

        const { startTime, endTime } = word

        let start = 0
        if (startTime !== undefined) {
          if (startTime.seconds !== undefined) {
            start += parseFloat(startTime.seconds)
          }
          if (startTime.nanos !== undefined) {
            start += startTime.nanos / 1000000000
          }
        }

        if (currentTime < start) {
          continue
        }

        let end = 0
        if (endTime !== undefined) {
          if (endTime.seconds !== undefined) {
            end += parseFloat(endTime.seconds)
          }
          if (endTime.nanos !== undefined) {
            end += endTime.nanos / 1000000000
          }
        }

        if (currentTime > end) {
          continue
        }
        console.log(word.word)

        this.setState({ currentTime, currentResult: i, currentWord: j })

        break loop
      }
    }
  }

  public setTime = (startTime: ITime) => {
    this.playerRef.current!.setTime(startTime.seconds ? Number(startTime.seconds) : 0)
  }

  public render() {
    const transcript = this.state.transcript

    // Loading from Firebase
    if (transcript === undefined) {
      return <TranscriptionProgress message={"Laster inn transkripsjon"} status={SweetProgressStatus.Active} symbol={"⏳"} />
    }
    // Transcription not found
    else if (transcript === null) {
      ReactGA.event({
        action: "Not found",
        category: "Transcription",
      })
      return <TranscriptionProgress message={"Fant ikke transkripsjonen"} status={SweetProgressStatus.Error} />
    } else {
      const progress = transcript.progress!

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

          if (transcript.results === undefined) {
            console.log(transcript.results)

            transcript.results = Array<IResult>()

            database
              .collection(`transcripts/${this.props.match.params.id}/results`)
              .orderBy("startTime")
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  const result = doc.data() as IResult

                  transcript.results.push(result)

                  this.setState({
                    transcript,
                  })
                })
              })
          }

          return (
            <>
              <main id="transcript">
                <div className="results">
                  <div className="meta">
                    <h1 className="org-text-xl">{transcript.name}</h1>
                    <form onSubmit={this.handleExportToWord}>
                      <button className="org-btn" type="submit">
                        <svg width="20" height="20" focusable="false" aria-hidden="true">
                          <use xlinkHref="#icon-download" />
                        </svg>{" "}
                        Last ned som Word
                      </button>
                    </form>
                  </div>
                  {Object.values(transcript.results).map((result, i) => {
                    const startTime = result.startTime || 0

                    const formattedStartTime = new Date(startTime * 1000).toISOString().substr(11, 8)

                    return (
                      <React.Fragment key={i}>
                        <div key={`startTime-${i}`} className="startTime">
                          {i > 0 ? formattedStartTime : ""}
                        </div>

                        <div key={`result-${i}`} className="result">
                          {result.words.map((word, j) => {
                            const isCurrentWord = this.state.currentResult === i && this.state.currentWord === j
                            return <Word key={`word-${i}-${j}`} word={word} isCurrentWord={isCurrentWord} handleClick={this.setTime} currentTime={this.state.currentTime} />
                          })}
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>
              </main>
              <Player ref={this.playerRef} fileUrl={transcript.url} handleTimeUpdate={this.handleTimeUpdate} />
            </>
          )

        case Status.Failed:
          const error = transcript.error
          return <TranscriptionProgress message={error!.message} status={SweetProgressStatus.Error} />

        default:
          return <TranscriptionProgress message={"Noe gikk galt!"} status={SweetProgressStatus.Error} />
      }
    }
  }

  private handleExportToWord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const id = this.props.match.params.id

    window.location.href = `${process.env.REACT_APP_FIREBASE_HTTP_CLOUD_FUNCTION_URL}/exportToDoc?id=${id}`
  }
}

export default Transcript
