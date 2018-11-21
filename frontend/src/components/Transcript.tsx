import * as React from "react"
import ReactGA from "react-ga"
import { RouteComponentProps } from "react-router"
import { Status, SweetProgressStatus } from "../enums"
import { database } from "../firebaseApp"
import { IResult, ITranscript, IWordInfo } from "../interfaces"
import secondsToTime from "../secondsToTime"
import Player from "./Player"
import TranscriptionProgress from "./TranscriptionProgress"
import Word from "./Word"

interface IState {
  currentResultIndex: number | undefined
  currentTime: number
  currentWordIndex: number | undefined
  transcript?: ITranscript
}

class Transcript extends React.Component<RouteComponentProps<any>, IState> {
  private playerRef = React.createRef<Player>()
  constructor(props: any) {
    super(props)
    this.state = {
      currentResultIndex: undefined,
      currentTime: 0,
      currentWordIndex: undefined,
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
      const transcript = documentSnapshot.data() as ITranscript

      this.setState({
        transcript,
      })
    })
  }

  public handleTimeUpdate = (currentTime: number) => {
    // Find the next current result and word

    const { currentResultIndex, currentWordIndex, transcript } = this.state

    if (transcript === undefined || transcript.results === undefined) {
      return
    }

    const { results } = transcript

    // First, we check if the current word is still being said

    if (currentResultIndex !== undefined && currentWordIndex !== undefined) {
      const currentWord = results[currentResultIndex].words[currentWordIndex]

      let end = 0
      if (currentWord.endTime !== undefined) {
        if (currentWord.endTime.seconds !== undefined) {
          end += parseFloat(currentWord.endTime.seconds)
        }
        if (currentWord.endTime.nanos !== undefined) {
          end += currentWord.endTime.nanos / 1000000000
        }
      }

      if (currentTime < end) {
        return
      }
    }
    // The current word has been said, start scanning for the next word
    // We assume that it will be the next word in the current result

    let nextWordIndex = 0
    let nextResultIndex = 0

    if (currentResultIndex !== undefined && currentWordIndex !== undefined) {
      nextWordIndex = currentWordIndex ? currentWordIndex + 1 : 0
      nextResultIndex = currentResultIndex

      if (nextWordIndex === results[currentResultIndex].words.length) {
        // This was the last word, reset word index and move to next result

        nextWordIndex = 0
        nextResultIndex = nextResultIndex + 1
      }
    }

    // Start scanning for next word
    for (let i = nextResultIndex; i < results.length; i++) {
      const words = results[i].words

      for (let j = nextWordIndex; j < words.length; j++) {
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
          // This word hasn't started yet, returning and waiting to be called again on new current time update
          return
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
          // This word is no longer being said, go to next
          continue
        }

        // console.log(word)

        this.setState({ currentTime, currentResultIndex: i, currentWordIndex: j })

        return
      }
    }
  }

  public setCurrentWord = (word: IWordInfo, resultIndex: number, wordIndex: number) => {
    let time = 0
    if (word.startTime !== undefined) {
      if (word.startTime.seconds !== undefined) {
        time += parseFloat(word.startTime.seconds)
      }
      if (word.startTime.nanos !== undefined) {
        time += word.startTime.nanos / 1000000000
      }
    }

    this.playerRef.current!.setTime(time)

    this.setState({
      currentResultIndex: resultIndex,
      currentWordIndex: wordIndex,
    })
  }

  public render() {
    const transcript = this.state.transcript

    // Loading from Firebase
    if (transcript === undefined) {
      return (
        <main id="loading">
          <TranscriptionProgress message={"Laster"} status={SweetProgressStatus.Active} symbol={"⏳"} />
        </main>
      )
    }
    // Transcription not found
    else if (transcript === null) {
      ReactGA.event({
        action: "Not found",
        category: "Transcription",
      })
      return (
        <main id="loading">
          <TranscriptionProgress message={"Fant ikke transkripsjonen"} status={SweetProgressStatus.Error} />
        </main>
      )
    } else {
      const progress = transcript.progress!

      switch (progress.status) {
        case Status.Analysing:
          // The file has been uploaded, and we're waiting for the Cloud function to start
          return (
            <main id="loading">
              <TranscriptionProgress message={"Analyserer"} status={SweetProgressStatus.Active} symbol={"🔍"} />
            </main>
          )

        case Status.Transcoding:
          return (
            <main id="loading">
              <TranscriptionProgress message={"Transkoder"} status={SweetProgressStatus.Active} symbol={"🤖"} />
            </main>
          )

        case Status.Transcribing:
          return (
            <main id="loading">
              <TranscriptionProgress message={"Transkriberer"} status={SweetProgressStatus.Active} percent={progress.percent} />
            </main>
          )

        case Status.Saving:
          return (
            <main id="loading">
              <TranscriptionProgress message={"Lagrer transkripsjon"} percent={progress.percent} />
            </main>
          )

        case Status.Success:
          // We have a transcription , show it

          // Read results

          if (transcript.results === undefined) {
            transcript.results = Array<IResult>()

            database
              .collection(`transcripts/${this.props.match.params.id}/results`)
              .orderBy("startTime")
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  const result = doc.data() as IResult

                  transcript.results.push(result)
                })

                this.setState({
                  transcript,
                })
              })
          }

          return (
            <>
              <main id="transcript">
                <div className="results">
                  <div className="meta">
                    <h1 className="org-text-xl">{transcript.title}</h1>
                    <form onSubmit={this.handleExportToWord}>
                      <button className="org-btn" type="submit">
                        <svg width="20" height="20" focusable="false" aria-hidden="true">
                          <use xlinkHref="#icon-download" />
                        </svg>{" "}
                        Last ned som Word
                      </button>
                    </form>
                  </div>
                  {transcript.results.map((result, i) => {
                    const startTime = result.startTime || 0

                    const formattedStartTime = secondsToTime(startTime)

                    return (
                      <React.Fragment key={i}>
                        <div key={`startTime-${i}`} className="startTime">
                          {i > 0 ? formattedStartTime : ""}
                        </div>

                        <div key={`result-${i}`} className="result">
                          {result.words.map((word, j) => {
                            const isCurrentWord = this.state.currentResultIndex === i && this.state.currentWordIndex === j
                            return <Word key={`word-${i}-${j}`} word={word} isCurrentWord={isCurrentWord} setCurrentWord={this.setCurrentWord} resultIndex={i} wordIndex={j} />
                          })}
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>
              </main>
              <Player ref={this.playerRef} fileUrl={transcript.audioUrls.original} handleTimeUpdate={this.handleTimeUpdate} />
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
