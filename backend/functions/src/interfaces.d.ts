import admin from "firebase-admin"

import { Status } from "./enums"

interface ITranscript {
  durationInSeconds?: number
  languageCode?: string
  url?: string
  name?: string
  results?: Array<IResult>
  error?: any
  progress?: {
    percent?: number | admin.firestore.FieldValue
    status?: Status
  }
  timestamps?: {
    analysing?: string
    transcoding?: string
    transcribing?: string
    saving?: string
    success?: string
    failed?: string
  }
}

interface IResult {
  startTime: number
  confidence: number
  transcript: string
  words: Array<IWord>
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
