import { Step, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, Timestamp } from "./enums"

interface ITranscript {
  createdAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
  name?: string
  playbackGsUrl?: string
  process?: {
    error?: any
    percent?: number
    step?: Step
  }
  metadata: IMetadata
  results?: Array<IResult>
  userId?: string
}

interface IMetadata {
  audioChannelCount?: number
  audioDuration?: number
  audioTopic?: string
  enableSeparateRecognitionPerChannel: boolean
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
  channelTag: number
  languageCode: string
  startTime: number
  confidence: number
  transcript: string
  words: Array<IWord>
}

interface IWord {
  confidence: number
  word: string
  endTime: number
  startTime: number
}
