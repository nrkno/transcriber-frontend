import * as React from "react"
import { Progress } from "react-sweet-progress"

const Loading = () => {
  return (
    <div className="wrapper">
      <div className="dropForm">
        <p className="loading">Laster inn transkripsjon</p>
        <Progress
          type="circle"
          percent={100}
          status="active"
          theme={{ active: { symbol: "⏳" } }}
        />
      </div>
    </div>
  )
}

export default Loading
