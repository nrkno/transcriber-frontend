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
  resultIdsWithChanges: Set<string>
  isEditing: boolean
}

class TranscriptResults extends Component<IProps, IState> {
  private playerRef = React.createRef<Player>()
  constructor(props: any) {
    super(props)
    this.state = {
      currentResultIndex: undefined,
      currentTime: 0,
      currentWordIndex: undefined,
      isEditing: false,
      resultIdsWithChanges: new Set<string>(),
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
        <KeyboardEventHandler handleKeys={["all"]} onKeyEvent={(key, event) => this.handleKeyPressed(key, event)} />
        <KeyboardEventHandler handleKeys={["meta+s", "ctrl+s"]} onKeyEvent={(key, event) => this.handleKeyPressedSave(key, event)} />
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

  private async handleKeyPressedSave(key: string, event: KeyboardEvent) {
    event.preventDefault() // So that the browser save dialog doesn't appear

    // Check result changes for which results have changes

    console.log("SAVESENNN")

    for (const resultId of this.state.resultIdsWithChanges) {
      console.log(resultId)

      const index = this.state.resultIds!.indexOf(resultId)

      const result = this.state.results![index]

      await database.doc(`transcripts/${this.props.transcriptId}/results/${resultId}`).update({ words: result.words })
    }
  }
  private handleKeyPressed(keyX: string, event: KeyboardEvent) {
    if (event.defaultPrevented) {
      return // Do nothing if the event was already processed
    }

    console.log("handleKeyPressed")

    console.log(event.getModifierState("Shift"))

    const key = event.key

    console.log("event.key:", event.key)

    // If left or right is pressed, we reset the indeces to 0,0 and return,
    // so that the first word is highlighted
    if ((key === "ArrowLeft" || key === "ArrowRight") && this.state.currentResultIndex === undefined && this.state.currentWordIndex === undefined) {
      this.setState({ currentResultIndex: 0, currentWordIndex: 0 })
      return
    }

    const currentWordIndex = this.state.currentWordIndex!
    const currentResultIndex = this.state.currentResultIndex!
    const results = this.state.results!

    if (this.state.currentResultIndex !== undefined && this.state.currentWordIndex !== undefined) {
      switch (event.key) {
        case " ":
          this.playerRef.current!.togglePlay()
        case "ArrowLeft":
        case "Left":
          if (currentWordIndex - 1 >= 0) {
            this.setState({ currentWordIndex: currentWordIndex - 1 })
          } else if (currentResultIndex - 1 >= 0) {
            this.setState({ currentResultIndex: currentResultIndex - 1, currentWordIndex: results![currentResultIndex - 1].words.length - 1 })
          }
          break

        case "ArrowRight":
        case "Right":
          if (currentWordIndex + 1 < results![currentResultIndex].words.length) {
            this.setState({ currentWordIndex: currentWordIndex + 1 })
          } else if (currentResultIndex + 1 < results!.length) {
            this.setState({ currentResultIndex: currentResultIndex + 1, currentWordIndex: 0 })
          }
          break

        case ".":
        case ",":
        case "!":
        case "?":
          const currentWord = this.state.results![currentResultIndex].words[currentWordIndex].word

          if (currentWord.endsWith(key)) {
            this.setWord(currentResultIndex, currentWordIndex, currentWord.slice(0, -1))

            // Decapitalize next word if it exist

            const nextWord = this.state.results![currentResultIndex].words[currentWordIndex + 1]

            if (nextWord !== undefined && (key === "." || key === "!" || key === "?")) {
              this.setWord(currentResultIndex, currentWordIndex + 1, nextWord.word[0].toLowerCase() + nextWord.word.substring(1))
            }
          } else {
            this.setWord(currentResultIndex, currentWordIndex, currentWord + key)

            const nextWord = this.state.results![currentResultIndex].words[currentWordIndex + 1]

            if (nextWord !== undefined && (key === "." || key === "!" || key === "?")) {
              this.setWord(currentResultIndex, currentWordIndex + 1, nextWord.word[0].toUpperCase() + nextWord.word.substring(1))
            }
          }

          console.log("word", currentWord)

          break

        case "a":
        case "b":
        case "c":
        case "d":
        case "e":
        case "f":
        case "g":
        case "h":
        case "i":
        case "j":
        case "k":
        case "l":
        case "m":
        case "n":
        case "o":
        case "p":
        case "q":
        case "r":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
        case "æ":
        case "ø":
        case "å":
        case "A":
        case "B":
        case "C":
        case "D":
        case "E":
        case "F":
        case "G":
        case "H":
        case "I":
        case "J":
        case "K":
        case "L":
        case "M":
        case "N":
        case "O":
        case "P":
        case "Q":
        case "R":
        case "S":
        case "T":
        case "U":
        case "V":
        case "W":
        case "X":
        case "Y":
        case "Z":
        case "Æ":
        case "Ø":
        case "Å":
          // Change the selected word

          if (this.state.isEditing) {
            this.setWord(currentResultIndex, currentWordIndex, this.state.results![currentResultIndex].words[currentWordIndex].word + key)
          } else {
            this.setWord(currentResultIndex, currentWordIndex, key)

            this.setState({ isEditing: true })
          }
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault()
      event.stopPropagation()
    }
  }

  private setWord(resultIndex: number, wordIndex: number, text: string) {
    const results = this.state.results!

    results[resultIndex].words[wordIndex].word = text

    const resultIdsWithChanges = this.state.resultIdsWithChanges!
    resultIdsWithChanges.add(this.state.resultIds![resultIndex])

    this.setState({
      resultIdsWithChanges,
      results,
    })
  }
}

export default TranscriptResults
