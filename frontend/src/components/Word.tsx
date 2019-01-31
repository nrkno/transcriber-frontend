import * as React from "react"
import { IWord } from "../interfaces"

interface IProps {
  confidence: number
  word: IWord
  isCurrentWord: boolean
  resultIndex: number
  wordIndex: number
  setCurrentWord(word: IWord, resultIndex: number, wordIndex: number): void
}

class Word extends React.Component<IProps, {}> {
  public render() {
    return (
      <>
        <span onClick={this.handleWordClick} className={`word confidence-${this.props.confidence} ` + `${this.props.isCurrentWord ? "active" : ""}`}>
          {this.props.word.word}
        </span>{" "}
      </>
    )
  }

  private handleWordClick = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    this.props.setCurrentWord(this.props.word, this.props.resultIndex, this.props.wordIndex)
  }
}

export default Word
