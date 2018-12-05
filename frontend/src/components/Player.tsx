import * as React from "react"
import ReactGA from "react-ga"
import secondsToTime from "../secondsToTime"

interface IState {
  isPlaying: boolean
  timer?: NodeJS.Timer
}

interface IProps {
  fileUrl: string
  handleTimeUpdate(currentTime: number): void
}

class Player extends React.Component<IProps, IState> {
  private audioRef = React.createRef<HTMLAudioElement>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      isPlaying: false,
    }
  }

  public componentWillUnmount() {
    clearInterval(this.state.timer)
    this.setState({ isPlaying: false, timer: undefined })
  }

  public handlePlay = (event: React.FormEvent<HTMLButtonElement>) => {
    this.play()

    ReactGA.event({
      action: "play button pressed",
      category: "player",
    })
  }
  public handlePause = (event: React.FormEvent<HTMLButtonElement>) => {
    this.audioRef.current!.pause()

    clearInterval(this.state.timer)

    this.setState({ isPlaying: false, timer: undefined })
    ReactGA.event({
      action: "pause button pressed",
      category: "player",
    })
  }
  public handleVolume = (event: React.FormEvent<HTMLInputElement>) => {
    this.audioRef.current!.volume = Number(event.currentTarget.value)
    ReactGA.event({
      action: "volume changed",
      category: "player",
    })
  }
  public setTime = (time: number) => {
    this.audioRef.current!.currentTime = time

    this.play()

    ReactGA.event({
      action: "word selected",
      category: "player",
    })
  }
  public render() {
    const currentTime = this.audioRef.current && this.audioRef.current.currentTime ? this.audioRef.current.currentTime : 0
    const duration = this.audioRef.current && this.audioRef.current.duration ? this.audioRef.current.duration : 0

    // Avoid division by zero
    const progress = duration !== 0 ? currentTime / duration : 0

    return (
      <div>
        <audio ref={this.audioRef} src={this.props.fileUrl} />
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

          <div className="currentTime">{secondsToTime(currentTime)}</div>
          <div className="timer-wrapper">
            <div className="timer-background">
              <div
                className="timer-current"
                style={{
                  transform: `translateX(-${100 - progress * 100}%)`,
                }}
              />
            </div>
          </div>
          <div className="duration">{secondsToTime(duration)}</div>
          <div className="volume">
            <input type="range" min="0" max="1" step="0.1" onChange={this.handleVolume} />
          </div>
        </div>
      </div>
    )
  }

  private play = () => {
    this.audioRef.current!.play()

    const timer = setInterval(() => {
      this.handleTimeUpdate()
    }, 100)

    this.setState({ isPlaying: true, timer })
  }
  private handleTimeUpdate = () => {
    const currentTime = this.audioRef.current!.currentTime

    this.props.handleTimeUpdate(currentTime)
  }
}

export default Player
