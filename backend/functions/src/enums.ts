export enum Step {
  Uploading = "UPLOADING",
  Transcoding = "TRANSCODING",
  Transcribing = "TRANSCRIBING",
  Saving = "SAVING",
  Done = "DONE",
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

// The encoding of the audio data sent in the request.
export enum AudioEncoding {
  Unspecified = "ENCODING_UNSPECIFIED", // Not specified.
  Linear16 = "LINEAR16", // 	Uncompressed 16-bit signed little-endian samples (Linear PCM).
  Flac = "FLAC", // 	FLAC (Free Lossless Audio Codec) is the recommended encoding because it is lossless--therefore recognition is not compromised--and requires only about half the bandwidth of LINEAR16. FLAC stream encoding supports 16-bit and 24-bit samples, however, not all fields in STREAMINFO are supported.
  Mulaw = "MULAW", // 	8-bit samples that compand 14-bit audio samples using G.711 PCMU/mu-law.
  Amr = "AMR", // 	Adaptive Multi-Rate Narrowband codec. sampleRateHertz must be 8000.
  AmrWb = "AMR_WB", // 	Adaptive Multi-Rate Wideband codec. sampleRateHertz must be 16000.
  OggOpus = "OGG_OPUS", // 	Opus encoded audio frames in Ogg container (OggOpus). sampleRateHertz must be one of 8000, 12000, 16000, 24000, or 48000.
  SpeedxWithHeaderByte = "SPEEX_WITH_HEADER_BYTE", // 	Although the use of lossy encodings is not recommended, if a very low bitrate encoding is required, OGG_OPUS is highly preferred over Speex encoding. The Speex encoding supported by Cloud Speech API has a header byte in each block, as in MIME type audio/x-speex-with-header-byte. It is a variant of the RTP Speex encoding defined in RFC 5574. The stream is a sequence of blocks, one block per RTP packet. Each block starts with a byte containing the length of the block, in bytes, followed by one or more frames of Speex data, padded to an integral number of bytes (octets) as specified in RFC 5574. In other words, each RTP header is replaced with a single byte containing the block length. Only Speex wideband is supported. sampleRateHertz must be 16000.
}
