import * as React from "react"
import { ITime, IWord } from "../interfaces"

interface IProps {
  word: IWord
  currentTime: number
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
        <span className={`${this.isActive()}`}>{this.props.word.word}</span>{" "}
      </span>
    )
    {
      /* tslint:enable */
    }
  }

  private isActive = () => {
    const { startTime, endTime } = this.props.word
    const { currentTime } = this.props

    let start = 0
    if (startTime !== undefined) {
      if (startTime.seconds !== undefined) {
        start += parseFloat(startTime.seconds)
      }
      if (startTime.nanos !== undefined) {
        start += startTime.nanos / 1000000000
      }
    }

    if (currentTime < start) {
      return ""
    }

    let end = 0
    if (endTime !== undefined) {
      if (endTime.seconds !== undefined) {
        end += parseFloat(endTime.seconds)
      }
      if (endTime.nanos !== undefined) {
        end += endTime.nanos / 1000000000
      }
    }

    if (currentTime > end) {
      return ""
    }
    return "active"
  }
}

export default Word
