import { Status, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType } from "./enums"

interface ITranscript {
  audioUrls?: {
    original?: string
    playback?: string
  }
  createdAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
  error?: any
  languageCodes: Array<string>
  metadata: IMetadata
  ownedBy?: string
  progress?: {
    percent?: number
    status?: Status
  }
  results?: Array<IResult>
  timestamps?: {
    analysing?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    transcoding?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    transcribing?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    saving?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    success?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
    failed?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
  }
  title?: string
}

interface IMetadata {
  audioTopic?: string
  duration?: number
  industryNaicsCodeOfAudio?: number | string
  interactionType: InteractionType
  microphoneDistance: MicrophoneDistance
  originalMediaType: OriginalMediaType
  originalMimeType?: string
  recordingDeviceName?: string
  recordingDeviceType: RecordingDeviceType
  speechContext?: {
    phrases: Array<string>
  }
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
