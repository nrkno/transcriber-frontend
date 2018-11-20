import admin from "firebase-admin"
import { Status } from "./enums"

interface ITranscript {
  audio?: IAudio
  createdAt?: Date | admin.firestore.FieldValue
  error?: any
  languageCodes?: Array<string>
  ownedBy?: string
  progress?: {
    percent?: number | admin.firestore.FieldValue
    status?: Status
  }
  results?: Array<IResult>
  timestamps?: {
    analysing?: Date | admin.firestore.FieldValue
    transcoding?: Date | admin.firestore.FieldValue
    transcribing?: Date | admin.firestore.FieldValue
    saving?: Date | admin.firestore.FieldValue
    success?: Date | admin.firestore.FieldValue
    failed?: Date | admin.firestore.FieldValue
  }
  title?: string
}

interface IAudio {
  duration?: number
  type?: string
  url?: string
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
