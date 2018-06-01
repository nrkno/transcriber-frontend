import * as React from "react"
import secondsToTime from "../secondsToTime"

interface IState {
  currentTime: number
  duration: number
  isPlaying: boolean
  progress: number
}

interface IProps {
  fileUrl: string
  handleTimeUpdate(event: React.ChangeEvent<HTMLAudioElement>): void
}

class Player extends React.Component<IProps, IState> {
  private audioRef = React.createRef<HTMLAudioElement>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      progress: 0
    }
  }

  public handleDurationChange = (
    event: React.ChangeEvent<HTMLAudioElement>
  ) => {
    this.setState({ duration: this.audioRef.current!.duration })
  }
  public handlePlay = (event: React.FormEvent<HTMLButtonElement>) => {
    this.audioRef.current!.play()
    this.setState({ isPlaying: true })
  }
  public handlePause = (event: React.FormEvent<HTMLButtonElement>) => {
    this.audioRef.current!.pause()
    this.setState({ isPlaying: false })
  }
  public handleVolume = (event: React.FormEvent<HTMLInputElement>) => {
    this.audioRef.current!.volume = Number(event.currentTarget.value)
  }
  public handleTimeUpdate = (event: React.ChangeEvent<HTMLAudioElement>) => {
    const currentTime = event.target.currentTime
    const progress = currentTime / this.audioRef.current!.duration
    this.setState({ currentTime, progress })
    this.props.handleTimeUpdate(event)
  }
  public setTime = (time: number) => {
    this.audioRef.current!.play()
    this.setState({ isPlaying: true })
    this.audioRef.current!.currentTime = time
  }
  public render() {
    return (
      <div>
        <audio
          ref={this.audioRef}
          onDurationChange={this.handleDurationChange}
          src={this.props.fileUrl}
          onTimeUpdate={this.handleTimeUpdate}
        />
        <div id="player">
          {!this.state.isPlaying ? (
            <button onClick={this.handlePlay}>
              <span role="img" aria-label="Spill av">
                ▶️
              </span>
            </button>
          ) : (
            <button onClick={this.handlePause}>
              <span role="img" aria-label="Pause">
                ⏸
              </span>
            </button>
          )}

          <div className="currentTime">
            {secondsToTime(this.state.currentTime)}
          </div>
          <div className="timer-wrapper">
            <div className="timer-background">
              <div
                className="timer-current"
                style={{
                  transform: `translateX(-${100 - this.state.progress * 100}%)`
                }}
              />
            </div>
          </div>
          <div className="duration">{secondsToTime(this.state.duration)}</div>
          <div className="volume">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              onChange={this.handleVolume}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Player
