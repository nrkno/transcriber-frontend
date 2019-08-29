import { ProgressType, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, Timestamp } from "./enums"

interface ITranscript {
  createdAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
  id?: string
  name?: string
  playbackGsUrl?: string
  status?: {
    error?: any
    percent?: number
    progress?: ProgressType
    lastUpdated?: firebase.firestore.Timestamp | firebase.firestore.FieldValue
  }
  metadata?: IMetadata
  paragraphs?: Array<IParagraph>
  speakerNames?: {
    [key: number]: string
  }
  userId?: string
}

interface IMetadata {
  audioDuration?: number
  audioTopic?: string
  fileExtension?: string
  framesPerSecond?: number
  industryNaicsCodeOfAudio?: number | string
  interactionType: InteractionType
  languageCodes: Array<string>
  microphoneDistance: MicrophoneDistance
  originalMediaType: OriginalMediaType
  originalMimeType?: string
  recordingDeviceName?: string
  recordingDeviceType: RecordingDeviceType
  speechContexts?: Array<ISpeechContext>
  startTime?: number
}

interface ISpeechContext {
  phrases: Array<string>
}

interface IParagraph {
  id: string
  speaker?: number
  startTime: number
  words: Array<IWord>
}

interface IWord {
  confidence: number
  deleted?: boolean
  text: string
  endTime: number
  startTime: number
}

// -----------------
// Update Progress
// -----------------
interface IUpdateProgressResponse {
    lastUpdated?: number
    transcriptionProgressPercent?: number
    transcriptId?: string
    updateStatus: UpdateStatusType
}
