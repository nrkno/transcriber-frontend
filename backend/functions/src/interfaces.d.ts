import admin from "firebase-admin"
import { Step, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, AudioEncoding, Timestamp } from "./enums"

// -----------
// Transcript
// -----------

interface ITranscript {
  createdAt?: admin.firestore.FieldValue | admin.firestore.Timestamp
  name?: string
  playbackGsUrl?: string
  process?: IProcess
  metadata?: IMetadata
  results?: Array<IResult>
  userId?: string
}

interface IProcess {
  error?: any
  percent?: number
  step?: Step
}

interface IMetadata {
  audioDuration?: number
  audioTopic?: string
  fileExtension?: string
  industryNaicsCodeOfAudio?: number
  interactionType?: InteractionType
  languageCodes?: Array<string>
  microphoneDistance?: MicrophoneDistance
  originalMediaType?: OriginalMediaType
  originalMimeType?: string
  recordingDeviceName?: string
  recordingDeviceType?: RecordingDeviceType
  speechContexts?: Array<ISpeechContext>
}

interface ISpeechContext {
  phrases: Array<string>
}

interface IResult {
  confidence: number
  startTime: number
  transcript: string
  words: Array<IWord>
}

interface IWord {
  word: string
  endTime: number
  startTime: number
}

// -----------------
// Google Speech API
// -----------------

interface ILongRunningRegonize {
  audio: IRecognitionAudio
  config: IRecognitionConfig
}

interface IRecognitionAudio {
  content?: string
  uri?: string
}

interface ISpeechRecognitionResult {
  alternatives: Array<ISpeechRecognitionAlternative>
}

interface ISpeechRecognitionAlternative {
  transcript: string
  confidence: number
  words: Array<IWordInfo>
}

interface IWordInfo {
  word: string
  endTime: ITime
  startTime?: ITime
}

interface ITime {
  nanos?: number
  seconds?: string
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

interface IRecognitionMetadata {
  audioTopic?: string
  industryNaicsCodeOfAudio?: number
  interactionType?: InteractionType
  microphoneDistance?: MicrophoneDistance
  originalMediaType?: OriginalMediaType
  originalMimeType?: string
  recordingDeviceName?: string
  recordingDeviceType?: RecordingDeviceType
  speechContexts?: Array<ISpeechContext>
}
