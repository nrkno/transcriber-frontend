import * as React from "react"
import { WordState } from "../enums"
import { IWord } from "../interfaces"

interface IProps {
  confidence: number
  word: IWord
  wordStates?: string
  shouldSelectSpace: boolean
  showBlinkingCursor: boolean
  resultIndex: number
  wordIndex: number
  setCurrentWord(word: IWord, resultIndex: number, wordIndex: number): void
}

class Word extends React.Component<IProps, {}> {
  public render() {
    return (
      <>
        <span onClick={this.handleWordClick} className={`word confidence-${this.props.confidence} ${this.props.wordStates ? this.props.wordStates : ""}`}>
          {this.props.word.word}
          {(() => {
            if (this.props.showBlinkingCursor) {
              return <span className="typewriter" />
            } else {
              return
            }
          })()}
        </span>

        {(() => {
          if (this.props.shouldSelectSpace) {
            return <span className={this.props.wordStates}> </span>
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
