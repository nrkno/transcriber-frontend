import admin from "firebase-admin"
import { Status, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, AudioEncoding } from "./enums"

interface ITranscript {
  createdAt?: Date
  duration?: number
  error?: any
  languageCodes?: Array<string>
  recognitionMetadata?: IRecognitionMetadata
  userId?: string
  playbackUrl?: string
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

interface IRecognitionMetadata {
  audioTopic?: string
  industryNaicsCodeOfAudio?: number
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

interface ILongRunningRegonize {
  audio: IRecognitionAudio
  config: IRecognitionConfig
}

interface IRecognitionAudio {
  content?: string
  uri?: string
}

interface IRecognitionConfig {
  alternativeLanguageCodes?: Array<string>
  audioChannelCount?: number
  diarizationSpeakerCount?: number
  enableAutomaticPunctuation?: boolean
  enableSeparateRecognitionPerChannel?: boolean
  enableSpeakerDiarization?: boolean
  enableWordConfidence?: boolean
  enableWordTimeOffsets?: boolean
  encoding?: AudioEncoding
  languageCode: string
  maxAlternatives?: number
  metadata?: IRecognitionMetadata
  model?: string
  profanityFilter?: boolean
  sampleRateHertz?: number
  speechContexts?: Array<ISpeechContext>
  useEnhanced?: boolean
}
