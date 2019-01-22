import * as React from "react"
import { WordState } from "../enums"
import { IWord } from "../interfaces"

interface IProps {
  word: IWord
  wordState?: WordState
  shouldSelectSpace: boolean
  resultIndex: number
  wordIndex: number
  setCurrentWord(word: IWord, resultIndex: number, wordIndex: number): void
}

class Word extends React.Component<IProps, {}> {
  public render() {
    return (
      <>
        <span onClick={this.handleWordClick} className={`word ${this.props.wordState ? this.props.wordState : ""}`}>
          {this.props.word.word}
          {/*(() => {
            if (this.props.wordState === WordState.Editing) {
              return <span className="blinking-cursor">|</span>
            } else {
              return
            }
          })()*/}
        </span>

        {(() => {
          if (this.props.shouldSelectSpace) {
            return <span className={this.props.wordState}> </span>
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
