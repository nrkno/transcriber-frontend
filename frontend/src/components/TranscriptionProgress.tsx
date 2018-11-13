import * as React from "react"
import { Progress } from "react-sweet-progress"
import "react-sweet-progress/lib/style.css"
import { SweetProgressStatus } from "../enums"

interface IProps {
  message?: string
  percent?: number
  status?: SweetProgressStatus
  symbol?: string
  title: string
}

interface IProgressProps {
  percent: number
  status: SweetProgressStatus | undefined
  style: any
  type: string
  theme?: {
    active: {
      symbol: string
      color: string
    }
  }
}

const TranscriptionProgress = ({ message, percent = 100, status, symbol, title }: IProps) => {
  const props: IProgressProps = {
    percent,
    status,
    style: { width: "85px", height: "85px" },
    type: "circle",
  }

  const className = status === SweetProgressStatus.Active ? "loading" : ""

  if (symbol !== undefined) {
    props.theme = { active: { symbol, color: "#efefef" } }
  }

  return (
    <>
      <div>{title}</div>
      <div className={className}>{message} </div>
      <Progress {...props} />
    </>
  )
}

export default TranscriptionProgress
