import * as React from "react"
import ReactGA from "react-ga"
import { storage } from "../firebaseApp"
import secondsToTime from "../secondsToTime"

interface IState {
  isPlaying: boolean
  playbackUrl?: string
  currentTime: number
}

interface IProps {
  playbackGsUrl: string
  handleTimeUpdate(currentTime: number): void
}

class Player extends React.Component<IProps, IState> {
  private audioRef: React.RefObject<HTMLAudioElement>
  private timer: number

  constructor(props: IProps) {
    super(props)

    this.audioRef = React.createRef<HTMLAudioElement>()

    this.state = {
      currentTime: 0,
      isPlaying: false,
    }
  }

  public componentDidMount() {
    this.fetchPlaybackUrl()
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.playbackGsUrl !== prevProps.playbackGsUrl) {
      this.fetchPlaybackUrl()

      // Reset state

      this.setState({ isPlaying: false })

      if (this.audioRef.current) {
        this.audioRef.current.currentTime = 0
      }

      clearInterval(this.timer)
    }
  }

  public componentWillUnmount() {
    clearInterval(this.timer)
  }

  public togglePlay() {
    if (this.state.isPlaying) {
      this.audioRef.current!.pause()

      clearInterval(this.timer)

      this.setState({ isPlaying: false })
      ReactGA.event({
        action: "pause button pressed",
        category: "player",
      })
    } else {
      this.play()

      ReactGA.event({
        action: "play button pressed",
        category: "player",
      })
    }
  }

  public handlePlay = (event: React.FormEvent<HTMLButtonElement>) => {
    this.togglePlay()
  }
  public handlePause = (event: React.FormEvent<HTMLButtonElement>) => {
    this.togglePlay()
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

    if (this.state.playbackUrl === undefined) {
      return <div />
    }

    return (
      <div>
        <audio ref={this.audioRef} src={this.state.playbackUrl} />
        <div id="player">
          {!this.state.isPlaying ? (
            <button onClick={this.handlePlay}>
              <span role="img" aria-label="Spill av">
                <svg width="40" height="40" focusable="false" aria-hidden="true">
                  <use xlinkHref="#icon-play-c" />
                </svg>
              </span>
            </button>
          ) : (
            <button onClick={this.handlePause}>
              <span role="img" aria-label="Pause">
                <svg width="40" height="40" focusable="false" aria-hidden="true">
                  <use xlinkHref="#icon-pause-c" />
                </svg>
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

  private fetchPlaybackUrl() {
    storage

      .refFromURL(this.props.playbackGsUrl)
      .getDownloadURL()
      .then(url => {
        this.setState({ playbackUrl: url })
      })
      .catch(error => {
        // Handle any errors

        console.error(error)
      })
  }

  private play = () => {
    this.audioRef.current!.play()

    this.timer = setInterval(() => {
      this.handleTimeUpdate()
    }, 100)

    this.setState({ isPlaying: true })
  }
  private handleTimeUpdate = () => {
    const currentTime = this.audioRef.current!.currentTime

    this.setState({ currentTime })
    this.props.handleTimeUpdate(currentTime)
  }
}

export default Player
