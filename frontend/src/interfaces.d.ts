import { Status } from "./enums"

interface ITranscript {
  audio: IAudio
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue
  error?: any
  languageCodes: Array<string>
  ownedBy: string
  progress?: {
    percent?: number
    status?: Status
  }
  results?: Array<IResult>
  timestamps: {
    analysing?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    transcoding?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    transcribing?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    saving?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    success?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    failed?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
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
