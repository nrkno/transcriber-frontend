import React, { Component } from "react"
import KeyboardEventHandler from "react-keyboard-event-handler"
import TrackVisibility from "react-on-screen"
import { database } from "../firebaseApp"
import { IResult, ITranscript, IWord } from "../interfaces"
import secondsToTime from "../secondsToTime"
import Player from "./Player"
import Word from "./Word"

interface IProps {
  transcript: ITranscript
  transcriptId: string
}

interface IState {
  currentResultIndex: number | undefined
  currentTime: number
  currentWordIndex: number | undefined
  results?: IResult[]
  resultIds?: string[]
}

class TranscriptResults extends Component<IProps, IState> {
  private playerRef = React.createRef<Player>()
  constructor(props: any) {
    super(props)
    this.state = {
      currentResultIndex: undefined,
      currentTime: 0,
      currentWordIndex: undefined,
    }
  }

  public fetchResults() {
    const results = Array<IResult>()
    const resultIds = Array<string>()

    database
      .collection(`transcripts/${this.props.transcriptId}/results`)
      .orderBy("startTime")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const result = doc.data() as IResult

          results.push(result)

          resultIds.push(doc.id)
        })

        this.setState({
          resultIds,
          results,
        })
      })
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.transcriptId !== prevProps.transcriptId) {
      this.fetchResults()

      // Reset state

      this.setState({
        currentResultIndex: undefined,
        currentTime: 0,
        currentWordIndex: undefined,
        results: undefined,
      })
    }
  }

  public componentDidMount() {
    this.fetchResults()
  }
  public handleTimeUpdate = (currentTime: number) => {
    // Find the next current result and word

    const { currentResultIndex, currentWordIndex } = this.state

    if (this.props.transcript === undefined || this.state.results === undefined) {
      return
    }

    const { results } = this.state

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
    return (
      <>
        <KeyboardEventHandler handleKeys={["all"]} onKeyEvent={(key, e) => this.handleKeyPressed(key)} />
        {this.state.results &&
          this.state.results.map((result, i) => {
            const startTime = result.startTime

            const formattedStartTime = secondsToTime(startTime * 1e-9)

            return (
              <React.Fragment key={i}>
                <div key={`startTime-${i}`} className="startTime">
                  {i > 0 ? formattedStartTime : ""}
                </div>
                <div key={`result-${i}`} className="result">
                  <TrackVisibility partialVisibility={true}>
                    {({ isVisible }) => {
                      if (isVisible) {
                        return result.words.map((word, j) => {
                          const isCurrentWord = this.state.currentResultIndex === i && this.state.currentWordIndex === j
                          return <Word key={`word-${i}-${j}`} word={word} isCurrentWord={isCurrentWord} setCurrentWord={this.setCurrentWord} resultIndex={i} wordIndex={j} />
                        })
                      } else {
                        return result.words.map(word => {
                          return word.word + " "
                        })
                      }
                    }}
                  </TrackVisibility>
                </div>
              </React.Fragment>
            )
          })}

        <Player ref={this.playerRef} playbackGsUrl={this.props.transcript.playbackGsUrl} handleTimeUpdate={this.handleTimeUpdate} />
      </>
    )
  }

  private handleKeyPressed(key: string, event) {
    console.log(this.state.currentResultIndex)
    console.log(this.state.currentWordIndex)

    console.log(key)

    if (this.state.currentResultIndex !== undefined && this.state.currentWordIndex !== undefined) {
      switch (key) {
        case "space":
        // this.playerRef.current!.handlePlay()
        case "left":
          if (this.state.currentWordIndex - 1 >= 0) {
            this.setState({ currentWordIndex: this.state.currentWordIndex - 1 })
          } else if (this.state.currentResultIndex - 1 >= 0) {
            this.setState({ currentResultIndex: this.state.currentResultIndex - 1, currentWordIndex: this.state.results![this.state.currentResultIndex - 1].words.length - 1 })
          }
          break

        case "right":
          if (this.state.currentWordIndex + 1 < this.state.results![this.state.currentResultIndex].words.length) {
            this.setState({ currentWordIndex: this.state.currentWordIndex + 1 })
          } else if (this.state.currentResultIndex + 1 < this.state.results!.length) {
            this.setState({ currentResultIndex: this.state.currentResultIndex + 1, currentWordIndex: 0 })
          }
          break

        case ".":
          // Add period to the word we're at

          const resultIndex = this.state.currentResultIndex
          const wordIndex = this.state.currentWordIndex

          const word = this.state.results![resultIndex].words[wordIndex].word

          if (word.endsWith(".")) {
            // Remove period
            this.setWord(resultIndex, wordIndex, word.slice(0, -1))
            // Decapitalize next word if it exist

            const nextWord = this.state.results![resultIndex].words[wordIndex + 1]

            if (nextWord !== undefined) {
              this.setWord(resultIndex, wordIndex + 1, nextWord.word[0].toLowerCase() + nextWord.word.substring(1))
            }
          } else {
            this.setWord(resultIndex, wordIndex, word + ".")

            const nextWord = this.state.results![resultIndex].words[wordIndex + 1]

            if (nextWord !== undefined) {
              this.setWord(resultIndex, wordIndex + 1, nextWord.word[0].toUpperCase() + nextWord.word.substring(1))
            }
          }

          console.log("word", word)

          break
      }
    }

    console.log(`do something upon keydown event of ${key}`)
  }

  private setWord(resultIndex: number, wordIndex: number, text: string) {
    const results = this.state.results

    const resultId = this.state.resultIds[resultIndex]

    console.log(resultIndex)

    console.log(resultId)
    console.log(results)
    console.log(results[resultId])

    results[resultIndex].words[wordIndex].word = text

    this.setState({
      results,
    })

    // database.collection(`transcripts/${this.props.transcriptId}/results/${resultId}`)
  }
}

export default TranscriptResults
