import * as React from "react"
import { ITime, IWordInfo } from "../interfaces"

interface IProps {
  word: IWordInfo
  currentTime: number
  isCurrentWord: boolean
  handleClick(startTime: ITime): void
}

class Word extends React.Component<IProps, {}> {
  public render() {
    {
      // FIXME
      /* tslint:disable */
    }
    return (
      <span onClick={() => this.props.handleClick(this.props.word.startTime)}>
        <span className={`${this.props.isCurrentWord ? "active" : ""}`}>{this.props.word.word}</span>{" "}
      </span>
    )
    {
      /* tslint:enable */
    }
  }
}

export default Word
