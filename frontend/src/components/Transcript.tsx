import * as React from "react"
import ReactGA from "react-ga"
import { RouteComponentProps } from "react-router"
import { SweetProgressStatus } from "../enums"
import { database } from "../firebaseApp"
import { IResult, ITranscript, IWord } from "../interfaces"
import secondsToTime from "../secondsToTime"
import Player from "./Player"
import TranscriptionProgress from "./TranscriptionProgress"
import Word from "./Word"

interface IState {
  currentResultIndex: number | undefined
  currentTime: number
  currentWordIndex: number | undefined
  transcript: ITranscript | null
}

class Transcript extends React.Component<RouteComponentProps<any>, IState> {
  private playerRef = React.createRef<Player>()
  constructor(props: any) {
    super(props)
    this.state = {
      currentResultIndex: undefined,
      currentTime: 0,
      currentWordIndex: undefined,
      transcript: null,
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

      if (currentTime < currentWord.endTime * 1e-9) {
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

        if (currentTime < startTime * 1e-9) {
          // This word hasn't started yet, returning and waiting to be called again on new current time update
          return
        }

        if (currentTime > endTime * 1e-9) {
          // This word is no longer being said, go to next
          continue
        }

        this.setState({ currentTime, currentResultIndex: i, currentWordIndex: j })

        return
      }
    }
  }

  public setCurrentWord = (word: IWord, resultIndex: number, wordIndex: number) => {
    this.playerRef.current!.setTime(word.startTime * 1e-9)

    this.setState({
      currentResultIndex: resultIndex,
      currentWordIndex: wordIndex,
    })
  }

  public render() {
    const transcript = this.state.transcript

    // Loading from Firebase
    if (transcript === null) {
      return (
        <main id="loading">
          <TranscriptionProgress message={"Laster"} status={SweetProgressStatus.Active} symbol={"⏳"} />
        </main>
      )
    }
    // Transcription not found
    else if (transcript === undefined) {
      ReactGA.event({
        action: "transcript not found",
        category: "transcript",
        label: this.props.match.params.id,
      })
      return (
        <main id="loading">
          <TranscriptionProgress message={"Fant ikke transkripsjonen"} status={SweetProgressStatus.Error} />
        </main>
      )
    } else {
      const progress = transcript.process!

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
              {transcript.results.map((result, i) => {
                const startTime = result.startTime

                const formattedStartTime = secondsToTime(startTime * 1e-9)

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
          <Player ref={this.playerRef} fileUrl={transcript.playbackUrl} handleTimeUpdate={this.handleTimeUpdate} />
        </>
      )
    }
  }

  private handleExportToWord = async (event: React.FormEvent<HTMLFormElement>) => {
    ReactGA.event({
      action: "export button pressed",
      category: "transcript",
      label: "docx",
    })

    event.preventDefault()

    const id = this.props.match.params.id

    window.location.href = `${process.env.REACT_APP_FIREBASE_HTTP_CLOUD_FUNCTION_URL}/exportToDoc?id=${id}`
  }
}

export default Transcript
