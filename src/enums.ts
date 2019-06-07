export enum ProgressType {
  Uploading = "UPLOADING",
  Analysing = "ANALYSING",
  Transcribing = "TRANSCRIBING",
  Saving = "SAVING",
  Done = "DONE",
}

// The status types from UpdateProgress
export enum UpdateStatusType {
  UpdatedOk = "UPDATED_OK", // Import from Google Speech successfull, and written to database ok.
  SpeechRecognitionInProgress = "SPEECH_RECOGNITION_IN_PROGRESS", // Google is not yet finished transcribing the file
  SpeechRecognitionNotStarted = "SPEECH_RECOGNITION_NOT_STARTED",
  SpeechRecognitionMissing = "SPEECH_RECOGNITION_MISSING", // The speech data originally recorded on a video.
  TranscriptionIdMissing = "TRANSCRIPTION_ID_MISSING",
  TranscriptionMissing = "TRANSCRIPTION_MISSING" // Transcription could not be found in database.
}

// Use case categories that the audio recognition request can be described by.
export enum InteractionType {
  Unspecified = "INTERACTION_TYPE_UNSPECIFIED", // Use case is either unknown or is something other than one of the other values below.
  Discussion = "DISCUSSION", // Multiple people in a conversation or discussion. For example in a meeting with two or more people actively participating. Typically all the primary people speaking would be in the same room (if not, see PHONE_CALL)
  Presentaton = "PRESENTATION", // One or more persons lecturing or presenting to others, mostly uninterrupted.
  PhoneCall = "PHONE_CALL", // A phone-call or video-conference in which two or more people, who are not in the same room, are actively participating.
  Voicemail = "VOICEMAIL", // A recorded message intended for another person to listen to.
  ProfessionallyProduced = "PROFESSIONALLY_PRODUCED", // Professionally produced audio (eg. TV Show, Podcast).
  VoiceSearch = "VOICE_SEARCH", // Transcribe spoken questions and queries into text.
  VoiceCommand = "VOICE_COMMAND", // Transcribe voice commands, such as for controlling a device.
  Dictation = "DICTATION", // Transcribe speech to text to create a written document, such as a text-message, email or report.
}

// Enumerates the types of capture settings describing an audio file.
export enum MicrophoneDistance {
  Unspecified = "MICROPHONE_DISTANCE_UNSPECIFIED", // Audio type is not known.
  Nearfield = "NEARFIELD", // The audio was captured from a closely placed microphone. Eg. phone, dictaphone, or handheld microphone. Generally if there speaker is within 1 meter of the microphone.
  Midfield = "MIDFIELD", // The speaker if within 3 meters of the microphone.
  Farfield = "FARFIELD", // The speaker is more than 3 meters away from the microphone.
}

// The original media the speech was recorded on.
export enum OriginalMediaType {
  Unspecified = "ORIGINAL_MEDIA_TYPE_UNSPECIFIED", // Unknown original media type.
  Audio = "AUDIO", // The speech data is an audio recording.
  Video = "VIDEO", // The speech data originally recorded on a video.
}

// The type of device the speech was recorded with.
export enum RecordingDeviceType {
  Unspecified = "RECORDING_DEVICE_TYPE_UNSPECIFIED", // 	The recording device is unknown.
  Smartphone = "SMARTPHONE", // Speech was recorded on a smartphone.
  PC = "PC", // Speech was recorded using a personal computer or tablet.
  PhoneLine = "PHONE_LINE", // Speech was recorded over a phone line.
  Vehicle = "VEHICLE", // Speech was recorded in a vehicle.
  OtherOutdoorDevice = "OTHER_OUTDOOR_DEVICE", // Speech was recorded outdoors.
  OtherIndoorDevice = "OTHER_INDOOR_DEVICE", // Speech was recorded indoors.
}
