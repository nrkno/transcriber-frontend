import equal from "fast-deep-equal"
import update from "immutability-helper"
import React, { Component } from "react"
import ReactGA from "react-ga"
import KeyboardEventHandler from "react-keyboard-event-handler"
import TrackVisibility from "react-on-screen"
import { connect } from "react-redux"
import { withFirestore } from "react-redux-firebase"
import { compose } from "recompose"
import { Dispatch } from "redux"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import { database } from "../firebaseApp"
import { IResult, ITranscript, IWord } from "../interfaces"
import secondsToTime from "../secondsToTime"
import { updateMarkers } from "../store/actions/markersActions"
import { deleteWords, joinResults, readResults, splitResults, updateSpeaker, updateSpeakerName, updateWords } from "../store/actions/transcriptActions"
import Player from "./Player"
import Word from "./Word"

interface IState {
  currentTime: number
  markerResultIndex?: number
  markerWordIndexStart?: number
  markerWordIndexEnd?: number
  edits?: [string]
  selectingForward: boolean
}

interface IReduxStateToProps {
  markers: {
    future: [
      {
        resultIndex: number
        wordIndexStart: number
        wordIndexEnd: number
      }
    ]
    past: [
      {
        resultIndex: number
        wordIndexStart: number
        wordIndexEnd: number
      }
    ]
    present: {
      resultIndex?: number
      wordIndexStart?: number
      wordIndexEnd?: number
    }
  }
  transcript: {
    future: ITranscript[]
    past: ITranscript[]
    present: ITranscript
  }
  transcriptId: string
}

interface IReduxDispatchToProps {
  joinResults: (resultIndex: number, wordIndex: number) => void
  onRedo: () => void
  onUndo: () => void
  readResults: (results: IResult[]) => void
  splitResults: (resultIndex: number, wordIndex: number) => void
  deleteWords: (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => void
  updateMarkers: (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => void
  updateSpeaker: (resultIndex: number, speaker: number) => void
  updateSpeakerName: (speaker: number, name: string, resultIndex?: number) => void
  updateWords: (resultIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) => void
}

class TranscriptResults extends Component<IReduxStateToProps & IReduxDispatchToProps, IState> {
  public readonly state: IState = {
    currentTime: 0,
    selectingForward: true,
  }
  private playerRef = React.createRef<Player>()

  public componentDidUpdate(prevProps: IReduxStateToProps & IReduxDispatchToProps, prevState: IState) {
    const transcriptId = this.props.transcriptId
    const prevTranscriptId = prevProps.transcriptId

    if (transcriptId !== prevTranscriptId) {
      this.fetchResults(transcriptId)

      // Reset state
      this.setState({
        currentTime: 0,
        markerResultIndex: undefined,
        markerWordIndexEnd: undefined,
        markerWordIndexStart: undefined,
      })
      return
    }
    // Check if markers have been updated
    else if (prevProps.markers) {
      let markers

      if (prevProps.markers.past.length > this.props.markers.past.length) {
        markers = prevProps.markers.present
      } else if (prevProps.markers.future.length > this.props.markers.future.length) {
        markers = this.props.markers.present
      }

      // Set state if the current marker is different from the saved one
      if (markers !== undefined && (this.state.markerResultIndex !== markers.resultIndex || this.state.markerWordIndexStart !== markers.wordIndexStart || this.state.markerWordIndexEnd !== markers.wordIndexEnd)) {
        this.setState({
          markerResultIndex: markers.resultIndex,
          markerWordIndexEnd: markers.wordIndexEnd,
          markerWordIndexStart: markers.wordIndexStart,
        })
      }
    }

    // Check if we need to save to Firebase
    if (Math.abs(prevProps.transcript.past.length - this.props.transcript.past.length) === 1) {
      this.save(prevProps.transcript.present, this.props.transcript.present)
    }
  }

  public async componentDidMount() {
    const transcriptId = this.props.transcriptId

    this.fetchResults(transcriptId)
  }
  public handleTimeUpdate = (currentTime: number) => {
    // Find the next current result and word

    const { markerResultIndex, markerWordIndexStart } = this.state

    if (this.props.transcript === undefined || this.props.transcript.present.results === undefined) {
      return
    }

    const results = this.props.transcript.present.results

    // First, we check if the current word is still being said

    if (markerResultIndex !== undefined && markerWordIndexStart !== undefined) {
      const currentWord = results[markerResultIndex].words[markerWordIndexStart]

      if (currentTime < currentWord.endTime * 1e-9) {
        return
      }
    }
    // The current word has been said, start scanning for the next word
    // We assume that it will be the next word in the current result

    let nextWordIndex = 0
    let nextResultIndex = 0

    if (markerResultIndex !== undefined && markerWordIndexStart !== undefined) {
      nextWordIndex = markerWordIndexStart ? markerWordIndexStart + 1 : 0
      nextResultIndex = markerResultIndex

      if (nextWordIndex === results[markerResultIndex].words.length) {
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

        this.setState({
          currentTime,
          markerResultIndex: i,
          markerWordIndexEnd: j,
          markerWordIndexStart: j,
        })

        return
      }
    }
  }
  public setCurrentPlayingWord = (word: IWord, resultIndex: number, wordIndex: number) => {
    this.playerRef.current!.setTime(word.startTime * 1e-9)

    this.setState({
      edits: undefined,
      markerResultIndex: resultIndex,
      markerWordIndexEnd: wordIndex,
      markerWordIndexStart: wordIndex,
    })
  }

  public render() {
    return (
      <>
        <KeyboardEventHandler handleKeys={["all"]} onKeyEvent={this.handleKeyPressed} />
        {this.props.transcript &&
          this.props.transcript.present &&
          this.props.transcript.present.results &&
          this.props.transcript.present.results.map((result, i) => {
            const startTime = result.startTime

            const formattedStartTime = secondsToTime(startTime * 1e-9)
            const speaker = result.speaker

            return (
              <React.Fragment key={i}>
                <div key={`startTime-${i}`} className="startTime">
                  {formattedStartTime}
                  {speaker ? (
                    <>
                      <span className={`speaker speaker-${speaker}`} onClick={this.handleChangeSpeakerName(speaker)}>
                        {this.props.transcript.present.speakerNames[result.speaker][0].toUpperCase()}
                      </span>
                    </>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </div>
                <div key={`result-${i}`} className="result">
                  <TrackVisibility partialVisibility={true}>
                    {({ isVisible }) => {
                      if (isVisible) {
                        return result.words.map((word, j) => {
                          const isMarked = this.state.markerResultIndex === i && this.state.markerWordIndexStart <= j && j <= this.state.markerWordIndexEnd
                          const isEditing = isMarked && this.state.edits !== undefined

                          if (isEditing) {
                            // Only show the last word
                            if (j < this.state.markerWordIndexEnd) {
                              console.log("returning")

                              return
                            }

                            return this.state.edits.map((edit, k) => {
                              const isLastWord = this.state.edits.length - 1 === k
                              return (
                                <Word
                                  key={`word-${i}-${j}-${k}`}
                                  confidence={Math.round(word.confidence * 100)}
                                  showTypewriter={isLastWord}
                                  isMarked={isMarked}
                                  resultIndex={i}
                                  shouldSelectSpace={!isLastWord}
                                  setCurrentWord={this.setCurrentPlayingWord}
                                  text={edit}
                                  wordIndex={j}
                                />
                              )
                            })
                          } else {
                            const shouldSelectSpace = this.state.markerResultIndex === i && this.state.markerWordIndexStart <= j && j < this.state.markerWordIndexEnd

                            const isNextWordDeleted = j + 1 < result.words.length && result.words[j + 1].deleted !== undefined && result.words[j + 1].deleted === true

                            return (
                              <Word
                                key={`word-${i}-${j}`}
                                confidence={Math.round(word.confidence * 100)}
                                word={word}
                                showTypewriter={false}
                                isMarked={isMarked}
                                isNextWordDeleted={isNextWordDeleted}
                                resultIndex={i}
                                shouldSelectSpace={shouldSelectSpace}
                                setCurrentWord={this.setCurrentPlayingWord}
                                text={word.word}
                                wordIndex={j}
                              />
                            )
                          }
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

  private async fetchResults(transcriptId: string) {
    try {
      const querySnapshot = await this.props.firestore.get({ collection: `transcripts/${transcriptId}/results`, orderBy: "startTime" })

      const results = new Array()

      querySnapshot.docs.forEach(doc => {
        const result = doc.data()
        const id = doc.id
        results.push({ id, ...result })
      })

      this.props.readResults(results)
    } catch (error) {
      console.error("Error fetching results: ", error)
      ReactGA.exception({
        description: error.message,
        fatal: false,
      })
    }
  }

  private commitEdits(stopEditing: boolean) {
    const edits = this.state.edits

    if (edits !== undefined) {
      this.setWords(this.state.markerResultIndex, this.state.markerWordIndexStart, this.state.markerWordIndexEnd, edits, stopEditing)
    }
  }

  private handleChangeSpeakerName = (speaker: number) => (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (this.props.transcript.present.speakerNames !== undefined) {
      const currentSpeakerName = this.props.transcript.present.speakerNames[speaker]

      const newSpeakerName = window.prompt(`Navn på person ${speaker}:`, currentSpeakerName)

      if (newSpeakerName) {
        this.props.updateSpeakerName(speaker, newSpeakerName)
      }
    }
  }

  private handleKeyPressed = (_key: string, event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return // Do nothing if the event was already processed
    }

    const key = event.key
    const { markerResultIndex, markerWordIndexStart, markerWordIndexEnd } = this.state

    // Exit early if no word is selected
    if (markerResultIndex === undefined || markerWordIndexStart === undefined || markerWordIndexEnd === undefined) {
      // If arrow keys are pressed, we reset the indeces to 0,0
      // so that the first word is highlighted
      if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
        this.setState({
          markerResultIndex: 0,
          markerWordIndexEnd: 0,
          markerWordIndexStart: 0,
        })
      }

      return
    }

    // First, we check for meta or control keys
    if (event.getModifierState("Meta") || event.getModifierState("Control")) {
      switch (event.key) {
        // Join
        case "Backspace":
          // Works only if a single word is selected
          if (markerWordIndexStart === markerWordIndexEnd) {
            this.joinResults(markerResultIndex, markerWordIndexStart)
          }
          break
        // Split
        case "Enter":
          // Works only if a single word is selected
          if (markerWordIndexStart === markerWordIndexEnd) {
            this.splitResult(markerResultIndex, markerWordIndexStart)
          }
          break

        // Undo/redo
        case "z":
          if (event.getModifierState("Shift")) {
            this.props.onRedo()
          } else if (this.state.edits) {
            this.setState({ edits: undefined })
          } else {
            this.props.onUndo()
          }
          break

        // Speaker name
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.handleSetSpeaker(key, markerResultIndex)
          break
        // If we don't regonize the command, return and let the browser handle it
        default:
          return
      }
    } else {
      const editingForward = this.state.selectingForward
      const results = this.props.transcript.present.results!

      const currentWord = results![markerResultIndex].words[markerWordIndexEnd].word

      switch (event.key) {
        // Cancel edit
        case "Escape": {
          this.setState({
            edits: undefined,
          })
          break
        }

        // Go in and out of edit mode
        case "Enter":
          // Go out of edit mode
          if (this.state.edits !== undefined) {
            this.commitEdits(true)
          }
          // Go into edit mode if only word is selected
          else if (markerWordIndexStart === markerWordIndexEnd) {
            this.setState({
              edits: [currentWord],
            })
          }
          break

        // Select navigation
        case "ArrowLeft":
        case "Left":
          if (event.getModifierState("Shift")) {
            // Decrease selection
            if (editingForward && markerWordIndexStart < markerWordIndexEnd && markerWordIndexEnd > 0) {
              this.setState({
                edits: undefined,
                markerWordIndexEnd: markerWordIndexEnd - 1,
              })
              // Increase selection
            } else if (markerWordIndexStart > 0) {
              this.setState({
                edits: undefined,
                markerWordIndexStart: markerWordIndexStart - 1,
                selectingForward: false,
              })
            }
          } else {
            this.commitEdits(true)

            // Move marker

            if (markerWordIndexStart > 0) {
              // Mark previous word in current result
              const currentResultIndex = markerResultIndex
              const previousWordIndex = markerWordIndexStart - 1
              const previousWord = results[markerResultIndex].words[previousWordIndex]

              this.setCurrentPlayingWord(previousWord, currentResultIndex, previousWordIndex)
            } else if (markerResultIndex > 0) {
              // Mark last word in previous result

              const previousResultIndex = markerResultIndex - 1
              const previousWordIndex = results[markerResultIndex - 1].words.length - 1
              const previousWord = results[previousResultIndex].words[previousWordIndex]

              this.setCurrentPlayingWord(previousWord, previousResultIndex, previousWordIndex)
            }
          }

          break

        case "ArrowRight":
        case "Right":
          if (event.getModifierState("Shift")) {
            if (editingForward === false && markerWordIndexStart < markerWordIndexEnd) {
              this.setState({
                edits: undefined,
                markerWordIndexStart: markerWordIndexStart + 1,
              })
            }
            // Increase selection
            else if (markerWordIndexEnd + 1 < results[markerResultIndex].words.length) {
              this.setState({
                edits: undefined,
                markerWordIndexEnd: markerWordIndexEnd + 1,
                selectingForward: true,
              })
              // Decrease selection
            }
          } else {
            this.commitEdits(true)

            // Move marker

            const largestSelectedIndex = Math.max(markerWordIndexStart, markerWordIndexEnd)
            // If shift key is pressed, check if there is another word after markerWordIndexEnd
            if (largestSelectedIndex + 1 < results[markerResultIndex].words.length) {
              // Mark next word in current result

              const currentResultIndex = markerResultIndex
              const nextWordIndex = largestSelectedIndex + 1
              const nextWord = results[currentResultIndex].words[nextWordIndex]
              this.setCurrentPlayingWord(nextWord, currentResultIndex, nextWordIndex)
              // Mark first word in next result
            } else if (markerResultIndex + 1 < results.length) {
              const nextResultIndex = markerResultIndex + 1
              const firstWordIndex = 0
              const firstWord = results[nextResultIndex].words[firstWordIndex]

              this.setCurrentPlayingWord(firstWord, nextResultIndex, firstWordIndex)
            }
          }

          break

        case "ArrowUp":
        case "Up":
          this.commitEdits(true)

          // Jump to first word in current result
          if (markerWordIndexStart > 0) {
            const currentResultIndex = markerResultIndex
            const firstWordIndex = 0
            const firstWord = results[currentResultIndex].words[firstWordIndex]
            this.setCurrentPlayingWord(firstWord, currentResultIndex, firstWordIndex)

            // Jump to previous result
          } else if (markerResultIndex > 0) {
            const previousResultIndex = markerResultIndex - 1
            const firstWordIndex = 0
            const firstWord = results[previousResultIndex].words[firstWordIndex]
            this.setCurrentPlayingWord(firstWord, previousResultIndex, firstWordIndex)
          }

          break

        case "ArrowDown":
        case "Down":
          this.commitEdits(true)

          // Jump to next result if it exists

          if (markerResultIndex < results.length - 1) {
            const nextResultIndex = markerResultIndex + 1
            const nextWordIndex = 0
            const nextWord = results[nextResultIndex].words[nextWordIndex]

            this.setCurrentPlayingWord(nextWord, nextResultIndex, nextWordIndex)
          }
          // Jump to last word in last result
          else {
            const resultIndex = markerResultIndex
            const lastWordIndex = results[markerResultIndex].words.length - 1
            const lastWord = results[resultIndex].words[lastWordIndex]

            this.setCurrentPlayingWord(lastWord, resultIndex, lastWordIndex)
          }

          break

        // Tab will toggle the word from lowercase, first letter capitalized
        // Only works when not in edit mode, and only on a single word
        case "Tab":
          if (this.state.edits === undefined && markerWordIndexStart === markerWordIndexEnd) {
            // Lower case to capitalised case
            if (currentWord === currentWord.toLowerCase()) {
              this.updateWords(markerResultIndex, markerWordIndexStart, markerWordIndexEnd, [currentWord[0].toUpperCase() + currentWord.substring(1)], false)
            }
            // Lower case
            else {
              this.updateWords(markerResultIndex, markerWordIndexStart, markerWordIndexEnd, [currentWord.toLowerCase()], false)
            }
          }
          break

        // Space
        case " ":
          if (this.state.edits === undefined) {
            this.playerRef.current!.togglePlay()
          } else {
            this.commitEdits(false)
          }
          break

        // Delete
        case "Delete":
          this.deleteWords(markerResultIndex, markerWordIndexStart, markerWordIndexEnd)
          break

        // Punctation, when we're not in edit mode
        case ".":
        case ",":
        case "!":
        case "?":
          if (this.state.edits === undefined && markerWordIndexStart === markerWordIndexEnd) {
            const wordText = results![markerResultIndex].words[markerWordIndexEnd].word
            const nextWord = results[markerResultIndex].words[markerWordIndexEnd + 1]
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

            this.props.updateWords(markerResultIndex, markerWordIndexStart, markerWordIndexEnd + words.length - 1, words, false)

            break
          }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
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
        case "'":
        case "-":
        case '"':
        case "Backspace":
          // Change the selected word

          let edits = update(this.state.edits, {}) // Copy edits from state

          if (key === "Backspace") {
            if (edits === undefined) {
              this.deleteWords(markerResultIndex, markerWordIndexStart, markerWordIndexEnd)
            } else {
              edits[edits.length - 1] = edits[edits.length - 1].slice(0, -1)
            }
          }
          // Add character to last word
          else if (edits !== undefined) {
            edits[edits.length - 1] += key
          }
          // Replace marked word with entered character
          else {
            edits = [key]
          }
          this.setState({ edits })

          break
      }
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault()
    event.stopPropagation()
  }

  private async save(pastTranscript: ITranscript, presentTranscript: ITranscript) {
    const transcriptDocumentReference = database.doc(`transcripts/${presentTranscript.id}/`)

    // Get a new write batch
    const batch = database.batch()

    // Check if we have changes in the transcript

    if (presentTranscript.speakerNames !== undefined && Object.is(pastTranscript.speakerNames, presentTranscript.speakerNames) !== true) {
      batch.update(transcriptDocumentReference, {
        speakerNames: presentTranscript.speakerNames,
      })
    }

    const pastResults = pastTranscript.results
    const presentResults = presentTranscript.results

    // Changes in results
    if (pastResults !== undefined && presentResults !== undefined) {
      // Create an array with all result ids

      const pastResultsIds = pastResults.map(result => result.id)
      const presentResultsIds = presentResults.map(result => result.id)

      const resultsIds = new Set([...pastResultsIds, ...presentResultsIds])

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

      // Set the value in update Ids

      const resultsCollectionReference = transcriptDocumentReference.collection("results")

      for (const result of updateResults) {
        batch.update(resultsCollectionReference.doc(result.id), result)
      }

      for (const result of createResults) {
        batch.set(resultsCollectionReference.doc(result.id), result)
      }
      for (const resultId of deleteIds) {
        batch.delete(resultsCollectionReference.doc(resultId))
      }
    }

    try {
      await batch.commit()
    } catch (error) {
      console.error("Error saving to Firebase: ", error)
      ReactGA.exception({
        description: error.message,
        fatal: false,
      })
    }
  }

  private deleteWords(resultIndex: number, wordIndexStart: number, wordIndexEnd: number) {
    this.props.deleteWords(resultIndex, wordIndexStart, wordIndexEnd)

    // Saving marker in undo history
    this.props.updateMarkers(resultIndex, wordIndexStart, wordIndexEnd)
  }

  private setWords(resultIndex: number, wordIndexStart: number, wordIndexEnd: number, texts: [string], stopEditing: boolean) {
    this.updateWords(resultIndex, wordIndexStart, wordIndexEnd, texts, true)

    const edits = update(texts, { $push: [""] })

    this.setState({
      edits: stopEditing ? undefined : edits,
      markerWordIndexEnd: wordIndexStart + texts.length - 1,
    })
  }

  private handleSetSpeaker(key: string, markerResultIndex: number) {
    // Check that the speaker exists, otherwise, ask for their name

    if (this.props.transcript.present.speakerNames && this.props.transcript.present.speakerNames[parseInt(key, 10)] !== undefined) {
      this.props.updateSpeaker(markerResultIndex, parseInt(key, 10))
    } else {
      const speakerName = window.prompt(`Navn på person ${key}:`)

      if (speakerName) {
        this.props.updateSpeakerName(parseInt(key, 10), speakerName, markerResultIndex)
      }
    }
  }

  private updateWords(resultIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) {
    this.props.updateWords(resultIndex, wordIndexStart, wordIndexEnd, words, recalculate)
    this.props.updateMarkers(resultIndex, wordIndexStart, wordIndexEnd)
  }

  private joinResults(resultIndex: number, wordIndex: number) {
    // Calculating where the marker will be in the joined result

    if (resultIndex > 0 && wordIndex === 0) {
      const result = this.props.transcript.present.results[resultIndex - 1]

      // Saving marker in undo history
      this.props.updateMarkers(this.state.markerResultIndex, 0, 0)

      // Setting new marker state
      this.setState({
        markerResultIndex: resultIndex - 1,
        markerWordIndexEnd: result.words.length,
        markerWordIndexStart: result.words.length,
      })
      this.props.joinResults(resultIndex, wordIndex)
    }
  }

  private splitResult(resultIndex: number, wordIndex: number) {
    this.props.splitResults(resultIndex, wordIndex)

    // Saving marker in undo history
    this.props.updateMarkers(resultIndex, wordIndex, wordIndex)

    // Setting marker to the next result
    this.setState({
      markerResultIndex: resultIndex + 1,
      markerWordIndexEnd: 0,
      markerWordIndexStart: 0,
    })
  }
}

// Redux

const mapStateToProps = (state: State): IReduxStateToProps => {
  return {
    markers: state.markers,
    transcript: state.transcript,
  }
}

const mapDispatchToProps = (dispatch: Dispatch): IReduxDispatchToProps => {
  return {
    deleteWords: (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => dispatch(deleteWords(resultIndex, wordIndexStart, wordIndexEnd)),
    joinResults: (resultIndex: number, wordIndex: number) => dispatch(joinResults(resultIndex, wordIndex)),
    onRedo: () => dispatch(UndoActionCreators.redo()),
    onUndo: () => dispatch(UndoActionCreators.undo()),
    readResults: (results: IResult[]) => dispatch(readResults(results)),
    splitResults: (resultIndex: number, wordIndex: number) => dispatch(splitResults(resultIndex, wordIndex)),
    updateMarkers: (resultIndex: number, wordIndexStart: number, wordIndexEnd: number) => dispatch(updateMarkers(resultIndex, wordIndexStart, wordIndexEnd)),
    updateSpeaker: (resultIndex: number, speaker: number) => dispatch(updateSpeaker(resultIndex, speaker)),
    updateSpeakerName: (speaker: number, name: string, resultIndex: number) => dispatch(updateSpeakerName(speaker, name, resultIndex)),
    updateWords: (resultIndex: number, wordIndexStart: number, wordIndexEnd: number, words: string[], recalculate: boolean) => dispatch(updateWords(resultIndex, wordIndexStart, wordIndexEnd, words, recalculate)),
  }
}

const enhance = compose(
  withFirestore,
  connect<void, IDispatchProps, void>(
    mapStateToProps,
    mapDispatchToProps,
  ),
)

export default enhance(TranscriptResults)
