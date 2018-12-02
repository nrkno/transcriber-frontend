import { Step, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, Timestamp } from "./enums"

interface ITranscript {
  name?: string
  playbackUrl?: string
  process?: {
    error?: any
    percent?: number
    step?: Step
  }
  metadata: IMetadata
  results?: Array<IResult>
  timestamps?: { [x in Timestamp]?: firebase.firestore.Timestamp | firebase.firestore.FieldValue }
  userId?: string
}

interface IMetadata {
  audioDuration?: number
  audioTopic?: string
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
  startTime: number
  confidence: number
  transcript: string
  words: Array<IWord>
}

interface IWord {
  word: string
  endTime: number
  startTime: number
}
