import * as React from "react"
import { IWord } from "../interfaces"

interface IProps {
  confidence: number
  isPlaying: boolean
  isSelecting: boolean
  isEditing: boolean
  word: IWord
  shouldSelectSpace: boolean
  resultIndex: number
  wordIndex: number
  setCurrentWord(word: IWord, resultIndex: number, wordIndex: number): void
}

class Word extends React.Component<IProps, {}> {
  public render() {
    let classNames = ""
    if (this.props.isPlaying) {
      classNames += "playing"
    }
    if (this.props.isSelecting) {
      classNames += " selecting"
    }

    return (
      <>
        <span onClick={this.handleWordClick} className={`word confidence-${this.props.confidence} ${classNames}`}>
          {this.props.word.word}
          {(() => {
            if (this.props.isEditing) {
              return <span className="typewriter" />
            } else {
              return
            }
          })()}
        </span>

        {(() => {
          if (this.props.shouldSelectSpace) {
            return <span className={classNames}> </span>
          } else {
            return " "
          }
        })()}
      </>
    )
  }

  private handleWordClick = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    this.props.setCurrentWord(this.props.word, this.props.resultIndex, this.props.wordIndex)
  }
}

export default Word
