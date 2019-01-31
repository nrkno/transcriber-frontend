import equal from "fast-deep-equal"
import update from "immutability-helper"
import React, { Component } from "react"
import ReactGA from "react-ga"
import KeyboardEventHandler from "react-keyboard-event-handler"
import TrackVisibility from "react-on-screen"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import { database } from "../firebaseApp"
import { IResult, ITranscript, IWord } from "../interfaces"
import secondsToTime from "../secondsToTime"
import { joinResults, readResults, splitResults, updateWords } from "../store/actions/transcriptActions"
import Player from "./Player"
import Word from "./Word"

interface IState {
  currentTime: number
  currentPlayingResultIndex?: number
  currentPlayingWordIndex?: number
  currentSelectedResultIndex?: number
  currentSelectedWordIndexStart?: number
  currentSelectedWordIndexEnd?: number
  resultIds?: string[]
  editString?: string
}

interface IReduxStateToProps {
  transcript: {
    past: ITranscript[]
    present: ITranscript
  }
}

interface IReduxDispatchToProps {
  joinResults: (resultIndex: number, wordIndex: number) => void
  onRedo: () => void
  onUndo: () => void
  readResults: (transcriptId: string) => void
  splitResults: (resultIndex: number, wordIndex: number) => void
  updateWords: (resultIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) => void
}

class TranscriptResults extends Component<IReduxStateToProps & IReduxDispatchToProps, IState> {
  private playerRef = React.createRef<Player>()

  constructor(props: any) {
    super(props)
    this.state = {
      currentTime: 0,
    }
  }
  public componentDidUpdate(prevProps: IReduxStateToProps & IReduxDispatchToProps, prevState: IState) {
    if (this.props.transcript.present.id !== prevProps.transcript.present.id) {
      console.log("read")
      this.props.readResults(this.props.transcript.present.id)

      // Reset state

      this.setState({
        currentPlayingResultIndex: undefined,
        currentPlayingWordIndex: undefined,
        currentSelectedResultIndex: undefined,
        currentSelectedWordIndexEnd: undefined,
        currentSelectedWordIndexStart: undefined,
        currentTime: 0,
      })
    }

    /*TODO
    // Check last editing words ends with a space, in that case, we remove it.
    // Edit string ends with space and we are finished editing. We remove the extra space



    if (
      this.state.editString === undefined &&
      prevState.editString &&
      prevState.editString.endsWith(" ") &&
      this.props.transcript.present.results &&
      prevState.currentSelectedResultIndex !== undefined &&
      prevState.currentSelectedWordIndexEnd !== undefined
    ) {
      const wordWithoutSpace = this.props.transcript.present.results[prevState.currentSelectedResultIndex].words[prevState.currentSelectedWordIndexEnd].word.trim()

      console.log(`wordWithoutSpace${wordWithoutSpace}X`)
      const results = update(this.props.transcript.present.results, {
        [prevState.currentSelectedResultIndex]: {
          words: {
            [prevState.currentSelectedWordIndexEnd]: {
              word: { $set: wordWithoutSpace },
            },
          },
        },
      })

      this.setState({ results })
    }*/
    /*
    if (this.props.transcriptId !== prevProps.transcriptId) {
      this.fetchResults()

      // Reset state

      this.setState({
        currentPlayingResultIndex: undefined,
        currentPlayingWordIndex: undefined,
        currentTime: 0,
        results: undefined,
      })
    }
    */
  }

  public componentDidMount() {
    this.props.readResults(this.props.transcript.present.id)
  }
  public handleTimeUpdate = (currentTime: number) => {
    // Find the next current result and word

    const { currentPlayingResultIndex: currentResultIndex, currentPlayingWordIndex: currentWordIndex } = this.state

    if (this.props.transcript === undefined || this.props.transcript.present.results === undefined) {
      return
    }

    const results = this.props.transcript.present.results

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

        this.setState({ currentTime, currentPlayingResultIndex: i, currentPlayingWordIndex: j })

        return
      }
    }
  }

  public setCurrentPlayingWord = (word: IWord, resultIndex: number, wordIndex: number) => {
    this.playerRef.current!.setTime(word.startTime * 1e-9)

    this.setState({
      currentPlayingResultIndex: resultIndex,
      currentPlayingWordIndex: wordIndex,
    })
  }

  public render() {
    return (
      <>
        <KeyboardEventHandler handleKeys={["all"]} onKeyEvent={(key, event) => this.handleKeyPressed(key, event)} />
        {this.props.transcript &&
          this.props.transcript.present &&
          this.props.transcript.present.results &&
          this.props.transcript.present.results.map((result, i) => {
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
                          const isPlaying = this.state.currentPlayingResultIndex === i && this.state.currentPlayingWordIndex === j
                          const isSelecting = this.state.currentSelectedResultIndex === i && this.state.currentSelectedWordIndexStart <= j && j <= this.state.currentSelectedWordIndexEnd
                          const isEditing = isSelecting && j === this.state.currentSelectedWordIndexEnd && this.state.editString
                          const shouldSelectSpace = this.state.currentSelectedResultIndex === i && this.state.currentSelectedWordIndexStart <= j && j < this.state.currentSelectedWordIndexEnd
                          return (
                            <Word
                              key={`word-${i}-${j}`}
                              confidence={Math.round(word.confidence * 100)}
                              word={word}
                              isPlaying={isPlaying}
                              isSelecting={isSelecting}
                              isEditing={isEditing}
                              shouldSelectSpace={shouldSelectSpace}
                              setCurrentWord={this.setCurrentPlayingWord}
                              resultIndex={i}
                              wordIndex={j}
                            />
                          )
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

        <Player ref={this.playerRef} playbackGsUrl={this.props.transcript.present.playbackGsUrl} handleTimeUpdate={this.handleTimeUpdate} />
      </>
    )
  }

  private handleKeyPressed(keyX: string, event: KeyboardEvent) {
    if (event.defaultPrevented) {
      return // Do nothing if the event was already processed
    }

    const key = event.key
    console.log("event.key:", event.key)

    // If left or right is pressed, we reset the indeces to 0,0 and return,
    // so that the first word is highlighted
    if ((key === "ArrowLeft" || key === "ArrowRight") && this.state.currentSelectedResultIndex === undefined && this.state.currentSelectedWordIndexStart === undefined) {
      this.setState({
        currentSelectedResultIndex: 0,
        currentSelectedWordIndexEnd: 0,
        currentSelectedWordIndexStart: 0,
      })
      return
    }

    const currentPlayingResultIndex = this.state.currentPlayingResultIndex!
    const currentPlayingWordIndex = this.state.currentPlayingWordIndex!
    const currentSelectedResultIndex = this.state.currentSelectedResultIndex!
    const currentSelectedWordIndexStart = this.state.currentSelectedWordIndexStart!
    const currentSelectedWordIndexEnd = this.state.currentSelectedWordIndexEnd!
    const results = this.props.transcript.present.results!

    if (currentSelectedResultIndex !== undefined && currentSelectedWordIndexStart !== undefined) {
      const currentWord = results![currentSelectedResultIndex].words[currentSelectedWordIndexEnd].word

      switch (event.key) {
        case "Enter":
          if (event.getModifierState("Meta")) {
            this.splitResult(currentSelectedResultIndex, currentSelectedWordIndexStart)
          } else {
            console.log("Enter")
            // Go in and out of edit mode
            if (this.state.editString) {
              this.setState({
                editString: undefined,
              })
            } else {
              this.setState({
                editString: currentWord,
              })
            }
          }

          break
        case "ArrowLeft":
        case "Left":
          if (event.getModifierState("Meta")) {
            // Move playing marker to selected marker

            const markedWord = results[currentSelectedResultIndex].words[currentSelectedWordIndexStart]
            this.setCurrentPlayingWord(markedWord, currentSelectedResultIndex, currentSelectedWordIndexStart)
          } else {
            // Move selected marker

            if (currentSelectedWordIndexStart - 1 >= 0) {
              // Select previous word
              const previousWordIndex = currentSelectedWordIndexStart - 1
              this.setState({
                currentSelectedWordIndexEnd: previousWordIndex,
                currentSelectedWordIndexStart: previousWordIndex,
                editString: undefined,
              })
            } else if (currentSelectedResultIndex - 1 >= 0) {
              // Select last word in previous result

              console.log(results[currentSelectedResultIndex - 1].words.length - 1)
              this.setState({
                currentSelectedResultIndex: currentSelectedResultIndex - 1,
                currentSelectedWordIndexEnd: results[currentSelectedResultIndex - 1].words.length - 1,
                currentSelectedWordIndexStart: results[currentSelectedResultIndex - 1].words.length - 1,
                editString: undefined,
              })
              console.log(this.state)
            }
          }

          break

        case "ArrowRight":
        case "Right":
          if (event.getModifierState("Meta")) {
            // Move selected marker to playing marker

            this.setState({
              currentSelectedResultIndex: currentPlayingResultIndex,
              currentSelectedWordIndexEnd: currentPlayingWordIndex,
              currentSelectedWordIndexStart: currentPlayingWordIndex,
              editString: undefined,
            })
          } else {
            const largestSelectedIndex = Math.max(currentSelectedWordIndexStart, currentSelectedWordIndexEnd)
            // If shift key is pressed, check if there is another word after currentSelectedWordIndexEnd
            if (event.getModifierState("Shift") && currentSelectedWordIndexEnd + 1 < results[currentSelectedResultIndex].words.length) {
              this.setState({
                currentSelectedWordIndexEnd: currentSelectedWordIndexEnd + 1,
                editString: undefined,
              })
            } else if (largestSelectedIndex + 1 < results[currentSelectedResultIndex].words.length) {
              // Select next word
              const nextWordIndex = largestSelectedIndex + 1
              this.setState({
                currentSelectedWordIndexEnd: nextWordIndex,
                currentSelectedWordIndexStart: nextWordIndex,
                editString: undefined,
              })
            } else if (currentSelectedResultIndex + 1 < results.length) {
              console.log("Hiii")
              // Select first word in next result
              this.setState({
                currentSelectedResultIndex: currentSelectedResultIndex + 1,
                currentSelectedWordIndexEnd: 0,
                currentSelectedWordIndexStart: 0,
                editString: undefined,
              })
            }
          }

          break

        case "ArrowUp":
        case "Up":
          // Jump to first word in current result
          if (currentSelectedWordIndexStart > 0) {
            this.setState({
              currentSelectedWordIndexEnd: 0,
              currentSelectedWordIndexStart: 0,
              editString: undefined,
            })
            // Jump to previous result
          } else if (currentSelectedResultIndex > 0) {
            this.setState({
              currentSelectedResultIndex: currentSelectedResultIndex - 1,
              currentSelectedWordIndexEnd: 0,
              currentSelectedWordIndexStart: 0,
              editString: undefined,
            })
          }

          break

        case "ArrowDown":
        case "Down":
          // Jump to next result if it exists
          if (currentSelectedResultIndex < results.length - 1) {
            this.setState({
              currentSelectedResultIndex: currentSelectedResultIndex + 1,
              currentSelectedWordIndexEnd: 0,
              currentSelectedWordIndexStart: 0,
              editString: undefined,
            })
          }
          // Jump to last word
          else {
            const indexOfLastWord = results[currentSelectedResultIndex].words.length - 1
            this.setState({
              currentSelectedWordIndexEnd: indexOfLastWord,
              currentSelectedWordIndexStart: indexOfLastWord,
              editString: undefined,
            })
          }

          break

        //
        // Tab will toggle the word from lowercase, first letter capitalized
        // Only works when not in edit mode, and only on a single word
        case "Tab":
          if (this.state.editString === undefined && currentSelectedWordIndexStart === currentSelectedWordIndexEnd) {
            // Lower case to capitalised case
            if (currentWord === currentWord.toLowerCase()) {
              this.updateWords(currentSelectedResultIndex, currentSelectedWordIndexStart, currentSelectedWordIndexEnd, [currentWord[0].toUpperCase() + currentWord.substring(1)], false)
            }
            // Lower case
            else {
              this.updateWords(currentSelectedResultIndex, currentSelectedWordIndexStart, currentSelectedWordIndexEnd, [currentWord.toLowerCase()], false)
            }
          }
          break

        case " ":
          if (this.state.editString === undefined) {
            this.playerRef.current!.togglePlay()
            break
          }

        // Punctation
        // When we're not in edit mode,
        case ".":
        case ",":
        case "!":
        case "?":
          if (this.state.editString === undefined) {
            const wordText = results![currentSelectedResultIndex].words[currentSelectedWordIndexEnd].word
            const nextWord = results[currentSelectedResultIndex].words[currentSelectedWordIndexEnd + 1]
            const wordTextLastChar = wordText.charAt(wordText.length - 1)

            let removePuncation = false
            let addPuncation = false
            let nextWordToLowerCase = false
            let nextWordToUpperCase = false

            //
            // Remove punctation
            //

            // If last char is a punctation char, we remove it

            if (wordTextLastChar === "." || wordTextLastChar === "," || wordTextLastChar === "!" || wordTextLastChar === "?") {
              removePuncation = true

              // Lower case next word if it exist and is not lower case

              if (nextWord !== undefined && (key === "." || key === "!" || key === "?") && nextWord.word[0] === nextWord.word[0].toUpperCase()) {
                nextWordToLowerCase = true
              }
            }

            //
            // Add punctation
            //

            if (wordTextLastChar !== key) {
              // Add punctation

              addPuncation = true

              // Check to see if we need to lower case the next word
              if (nextWord !== undefined) {
                if (key === "." || key === "!" || key === "?") {
                  if (nextWord.word[0] !== nextWord.word[0].toUpperCase()) {
                    nextWordToUpperCase = true
                  } else {
                    // Next word is already uppercase, cancel the effect of nextWordToLowerCase = true from above
                    nextWordToLowerCase = false
                  }
                } else if (nextWord.word[0] !== nextWord.word[0].toLowerCase()) {
                  nextWordToLowerCase = true
                }
              }
            }

            let firstWordText = wordText
            let nextWordText = null

            if (removePuncation) {
              firstWordText = firstWordText.slice(0, -1)
            }
            if (addPuncation) {
              firstWordText += key
            }

            if (nextWordToUpperCase) {
              nextWordText = nextWord.word[0].toUpperCase() + nextWord.word.substring(1)
            } else if (nextWordToLowerCase) {
              nextWordText = nextWord.word[0].toLowerCase() + nextWord.word.substring(1)
            }

            const words = [firstWordText, nextWordText].filter(word => word)

            this.props.updateWords(currentSelectedResultIndex, currentSelectedWordIndexStart, currentSelectedWordIndexEnd + words.length - 1, words, false)

            break
          }
        // Saving
        case "s":
          if (event.getModifierState("Meta")) {
            this.save()

            break
          }
        // Undo/redo
        case "z":
          if (event.getModifierState("Meta")) {
            if (event.getModifierState("Shift")) {
              this.props.onRedo()
            } else {
              this.props.onUndo()
            }
            break
          }
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
        case "'":
        case "-":
        case '"':
        case "Backspace":
          // Change the selected word

          let editString = this.state.editString

          if (key === "Backspace") {
            if (event.getModifierState("Meta")) {
              this.props.joinResults(currentSelectedResultIndex, currentSelectedWordIndexStart)
              return
            } else if (editString === undefined) {
              editString = currentWord
            }
            editString = editString.slice(0, -1)
          } else if (this.state.editString) {
            editString += key
          } else {
            editString = key
          }
          console.log("EDIT STRING: ]", editString, "[")
          this.setWords(currentSelectedResultIndex, currentSelectedWordIndexStart, currentSelectedWordIndexEnd, editString)
          break
        case "Delete":
          this.deleteWords(currentSelectedResultIndex, currentSelectedWordIndexStart, currentSelectedWordIndexEnd, false)
          break
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault()
      event.stopPropagation()
    }
  }

  private async save() {
    console.log("SAVE")

    // Return if no changes
    if (this.props.transcript.past.length === 0) {
      return
    }

    // Create an array with all result ids

    const pastResults = this.props.transcript.past[0].results!
    const presentResults = this.props.transcript.present.results!

    const pastResultsIds = pastResults.map(result => result.id)
    const presentResultsIds = presentResults.map(result => result.id)

    const resultsIds = new Set([...pastResultsIds, ...presentResultsIds])

    console.log("resultsIds", resultsIds)

    const updateResults: IResult[] = new Array()
    const createResults: IResult[] = new Array()
    const deleteIds: string[] = new Array()

    for (const resultId of resultsIds) {
      if (pastResultsIds.includes(resultId) && presentResultsIds.includes(resultId)) {
        // In both arrays, need to compare them

        const pastResult = pastResults.filter(result => result.id === resultId)[0]
        const presentResult = presentResults.filter(result => result.id === resultId)[0]

        if (equal(pastResult, presentResult) === false) {
          updateResults.push(presentResult)
        }
      } else if (pastResultsIds.includes(resultId)) {
        // Only in past, need to delete
        deleteIds.push(resultId)
      } else {
        const presentResult = presentResults.filter(result => result.id === resultId)[0]

        createResults.push(presentResult)
        // Only in present, need to add
      }
    }

    const resultsCollectionReference = database.collection(`transcripts/${this.props.transcript.present.id}/results/`)
    console.log(resultsCollectionReference)
    // Get a new write batch
    const batch = database.batch()

    // Set the value in update Ids

    for (const result of updateResults) {
      batch.update(resultsCollectionReference.doc(result.id), result)
    }

    for (const result of createResults) {
      batch.set(resultsCollectionReference.doc(result.id), result)
    }
    for (const resultId of deleteIds) {
      batch.delete(resultsCollectionReference.doc(resultId))
    }

    try {
      await batch.commit()
    } catch (error) {
      console.error(error)
      ReactGA.exception({
        description: error.message,
        fatal: false,
      })
    }
  }

  private deleteWords(resultIndex: number, wordIndexStart: number, wordIndexEnd: number, selectPreviousWord: boolean) {
    const results = update(this.props.transcript.present.results, {
      [resultIndex]: {
        words: { $splice: [[wordIndexStart, wordIndexEnd - wordIndexStart + 1]] },
      },
    })

    let currentSelectedWordIndexStart = this.state.currentSelectedWordIndexStart!

    // Select the previous word
    if (selectPreviousWord && wordIndexStart > 0) {
      currentSelectedWordIndexStart--
    }

    this.setState({
      currentSelectedWordIndexEnd: currentSelectedWordIndexStart,
      currentSelectedWordIndexStart,
      editString: undefined,
      results,
    })
  }

  private setWords(resultIndex: number, wordIndexStart: number, wordIndexEnd: number, text: string) {
    // Replaces a consecutive set of whitespace characters by a single white space.
    // White spaces in the beginning and end are removed too
    // "    This    should  become   something          else   too. ";
    // becomes
    // "This should become something else too."
    console.log("text", text)
    const cleanText = text.replace(/\s+/g, " ").trim()
    console.log("Clean text", cleanText)

    const words = cleanText.split(" ")

    console.log("words", words)

    this.setState({
      currentSelectedWordIndexEnd: wordIndexStart + words.length - 1,
      editString: text,
    })

    this.updateWords(resultIndex, wordIndexStart, wordIndexEnd, words, true)
  }
  private updateWords(resultIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) {
    console.log("PRØVER Å SKRIVE over ord", resultIndex, wordIndexStart, wordIndexEnd, words, recalculate)

    this.props.updateWords(resultIndex, wordIndexStart, wordIndexEnd, words, recalculate)
  }

  private splitResult(resultIndex: number, wordIndex: number) {
    this.props.splitResults(resultIndex, wordIndex)
  }
}

// Redux

const mapStateToProps = (state: State): IReduxStateToProps => {
  return {
    transcript: state.transcript,
  }
}

const mapDispatchToProps = (dispatch: Dispatch): IReduxDispatchToProps => {
  return {
    joinResults: (resultIndex: number, wordIndex: number) => dispatch(joinResults(resultIndex, wordIndex)),
    onRedo: () => dispatch(UndoActionCreators.redo()),
    onUndo: () => dispatch(UndoActionCreators.undo()),
    readResults: (transcriptId: string) => dispatch(readResults(transcriptId)),
    splitResults: (resultIndex: number, wordIndex: number) => dispatch(splitResults(resultIndex, wordIndex)),
    updateWords: (resultIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) => dispatch(updateWords(resultIndex, wordIndexStart, wordIndexEnd, words, recalculate)),
  }
}

export default connect<void, IDispatchProps, void>(
  mapStateToProps,
  mapDispatchToProps,
)(TranscriptResults)
