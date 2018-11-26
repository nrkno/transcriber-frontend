import { Status, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType } from "./enums"

interface ITranscript {
  createdAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
  duration?: number
  error?: any
  languageCodes: Array<string>
  recognitionMetadata: IRecognitionMetadata
  userId?: string
  playbackUrl?: string
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

interface IRecognitionMetadata {
  audioTopic?: string
  industryNaicsCodeOfAudio?: number | string
  interactionType: InteractionType
  microphoneDistance: MicrophoneDistance
  originalMediaType: OriginalMediaType
  originalMimeType?: string
  recordingDeviceName?: string
  recordingDeviceType: RecordingDeviceType
  speechContexts?: Array<ISpeechContext>
}

interface ISpeechContext {
  phrases: Array<string>
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
