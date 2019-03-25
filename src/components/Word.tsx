import * as React from "react"
import { IWord } from "../interfaces"

interface IProps {
  confidence: number
  showTypewriter: boolean
  isMarked: boolean
  isNextWordDeleted: boolean
  paragraphIndex: number
  shouldSelectSpace: boolean
  text: string
  word?: IWord
  wordIndex: number
  setCurrentWord(word: IWord, paragraphIndex: number, wordIndex: number): void
}

class Word extends React.Component<IProps, {}> {
  public render() {
    return (
      <>
        <span onClick={this.handleWordClick} className={`word confidence-${this.props.confidence} ${this.props.isMarked ? "marker" : ""}`}>
          {this.props.word && this.props.word.deleted && this.props.word.deleted === true ? <s>{this.props.text}</s> : this.props.text}

          {(() => {
            // Type writer
            if (this.props.showTypewriter) {
              return <span className="typewriter" />
            } else {
              return
            }
          })()}
        </span>
        {(() => {
          // Space
          const strikeThrough = this.props.word && this.props.word.deleted && this.props.word.deleted === true && this.props.isNextWordDeleted === true
          if (this.props.shouldSelectSpace) {
            if (strikeThrough) {
              return <s className={this.props.isMarked ? "marker" : ""}> </s>
            } else {
              return <span className={this.props.isMarked ? "marker" : ""}> </span>
            }
          } else if (strikeThrough) {
            return <s> </s>
          } else {
            return " "
          }
        })()}
      </>
    )
  }

  private handleWordClick = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    if (this.props.word) {
      this.props.setCurrentWord(this.props.word, this.props.paragraphIndex, this.props.wordIndex)
    }
  }
}

export default Word
