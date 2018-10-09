import { Status } from "./enums"

interface ITranscription {
  audioFile: {
    languageCode: string
    url: string
    name: string
  }
  text?: { [key: string]: IWord }
  error?: IError
  progress: {
    percent?: number
    status: Status
  }
}

interface IWord {
  word: string
  endTime: ITime
  startTime?: ITime
}

interface ITime {
  nanos: number
  seconds: string
}

interface IError {
  code: number
  details: string
}
