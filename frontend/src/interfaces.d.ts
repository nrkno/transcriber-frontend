import { Status } from "./enums"

interface ITranscript {
  audio: IAudio
  createdAt: Date | firebase.firestore.FieldValue
  error?: any
  languageCode: string
  ownedBy: string
  progress?: {
    percent?: number
    status?: Status
  }
  results?: Array<IResult>
  timestamps: {
    analysing?: Date | firebase.firestore.FieldValue
    transcoding?: Date | firebase.firestore.FieldValue
    transcribing?: Date | firebase.firestore.FieldValue
    saving?: Date | firebase.firestore.FieldValue
    success?: Date | firebase.firestore.FieldValue
    failed?: Date | firebase.firestore.FieldValue
  }
  title: string
}

interface IAudio {
  duration?: number
  type: string
  url: string
}

interface IResult {
  startTime: number
  confidence: number
  transcript: string
  words: Array<IWordInfo>
}

interface IWordInfo {
  word: string
  endTime: ITime
  startTime?: ITime
}

interface ITime {
  nanos: number
  seconds: string
}
