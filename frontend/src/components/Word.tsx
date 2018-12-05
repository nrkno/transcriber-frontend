import * as React from "react"
import { IWord } from "../interfaces"

interface IProps {
  word: IWord
  isCurrentWord: boolean
  resultIndex: number
  wordIndex: number
  setCurrentWord(word: IWord, resultIndex: number, wordIndex: number): void
}

class Word extends React.Component<IProps, {}> {
  public render() {
    return (
      <span onClick={() => this.props.setCurrentWord(this.props.word, this.props.resultIndex, this.props.wordIndex)}>
        <span className={`${this.props.isCurrentWord ? "active" : ""}`}>{this.props.word.word}</span>{" "}
      </span>
    )
  }
}

export default Word
