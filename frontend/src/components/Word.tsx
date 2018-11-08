import * as React from "react"
import { IWordInfo } from "../interfaces"

interface IProps {
  word: IWordInfo
  isCurrentWord: boolean
  resultIndex: number
  wordIndex: number
  setCurrentWord(word: IWordInfo, resultIndex: number, wordIndex: number): void
}

class Word extends React.Component<IProps, {}> {
  public render() {
    {
      // FIXME
      /* tslint:disable */
    }
    return (
      <span onClick={() => this.props.setCurrentWord(this.props.word, this.props.resultIndex, this.props.wordIndex)}>
        <span className={`${this.props.isCurrentWord ? "active" : ""}`}>{this.props.word.word}</span>{" "}
      </span>
    )
    {
      /* tslint:enable */
    }
  }
}

export default Word
