import { Status } from "./enums"

interface ITranscription {
  audioFile: {
    url: string
    name: string
  }
  text?: { [key: string]: IWord }
  error?: Error
  progress?: {
    percent?: number
    status: Status
  }
}

interface IWord {
  word: string
  endTime: ITime
  startTime: ITime
}

interface ITime {
  nanos: number
  seconds: string
}
