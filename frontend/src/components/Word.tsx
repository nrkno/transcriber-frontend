import * as React from "react"
import { IWord } from "../interfaces"

interface IProps {
  confidence: number
  showTypewriter: boolean
  isMarked: boolean
  resultIndex: number
  shouldSelectSpace: boolean
  text: string
  word: IWord
  wordIndex: number
  setCurrentWord(word: IWord, resultIndex: number, wordIndex: number): void
}

class Word extends React.Component<IProps, {}> {
  public render() {
    return (
      <>
        <span onClick={this.handleWordClick} className={`word confidence-${this.props.confidence} ${this.props.isMarked ? "marker" : ""}`}>
          {this.props.text}
          {(() => {
            if (this.props.showTypewriter) {
              return <span className="typewriter" />
            } else {
              return
            }
          })()}
        </span>

        {(() => {
          if (this.props.shouldSelectSpace) {
            return <span className={this.props.isMarked ? "marker" : ""}> </span>
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
