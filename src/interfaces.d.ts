import { Step, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, Timestamp } from "./enums"

interface ITranscript {
  createdAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
  id?: string
  name?: string
  playbackGsUrl?: string
  process?: {
    error?: any
    percent?: number
    step?: Step
  }
  metadata?: IMetadata
  results?: Array<IResult>
  speakerNames?: {
    [key: number]: string
  }
  userId?: string
}

interface IMetadata {
  audioDuration?: number
  audioTopic?: string
  fileExtension?: string
  industryNaicsCodeOfAudio?: number | string
  interactionType: InteractionType
  languageCodes: Array<string>
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
  id: string
  speaker?: number
  startTime: number
  words: Array<IWord>
}

interface IWord {
  confidence: number
  deleted?: boolean
  word: string
  endTime: number
  startTime: number
}
