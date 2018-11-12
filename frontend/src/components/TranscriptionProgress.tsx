import * as React from "react"
import { Progress } from "react-sweet-progress"
import "react-sweet-progress/lib/style.css"
import { SweetProgressStatus } from "../enums"

interface IProps {
  message?: string
  percent?: number
  status?: SweetProgressStatus
  symbol?: string
}

interface IProgressProps {
  percent: number
  status: SweetProgressStatus | undefined
  theme?: {
    active: {
      symbol: string
      color: string
    }
  }
}

const TranscriptionProgress = ({ message, percent = 100, status, symbol }: IProps) => {
  // Show animating dots if there is progress going on

  const props: IProgressProps = {
    percent,
    status,
  }

  if (symbol !== undefined) {
    props.theme = { active: { symbol, color: "#efefef" } }
  }

  return (
    <main id="progress">
      <div>
        <p>{message}</p>
        <Progress {...props} />
      </div>
    </main>
  )
}

export default TranscriptionProgress
