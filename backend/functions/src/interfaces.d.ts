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
  startTime: number
  words: Array<IWord>
}

interface IWord {
  confidence: number
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
  confidence: number
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
  audioTopic?: string // An arbitrary description of the subject matter discussed in the audio file. Examples include "Guided tour of New York City," "court trial hearing," or "live interview between 2 people."
  industryNaicsCodeOfAudio?: number // The industry vertical of the audio file, as a 6-digit NAICS code.
  interactionType?: InteractionType // The use case of the audio.
  microphoneDistance?: MicrophoneDistance // The distance of the microphone from the speaker.
  //NOT IN USE obfuscatedId?: string //	The privacy-protected ID of the user, to identify number of unique users using the service.
  originalMediaType?: OriginalMediaType // The original media of the audio, either audio or video.
  originalMimeType?: string // The MIME type of the original audio file. Examples include audio/m4a, audio/x-alaw-basic, audio/mp3, audio/3gpp, or other audio file MIME type.
  recordingDeviceName?: string // The device used to make the recording. This arbitrary string can include names like 'Pixel XL', 'VoIP', 'Cardioid Microphone', or other value.
  recordingDeviceType?: RecordingDeviceType // The kind of device used to capture the audio, including smartphones, PC microphones, vehicles, etc.
}
