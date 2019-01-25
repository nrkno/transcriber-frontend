/**
 * @file Transcripts audio with Google Speech
 * @author Andreas Schjønhaug
 */

import speech from "@google-cloud/speech"
import database from "../database"
import { ILongRunningRegonize, IRecognitionMetadata, ISpeechRecognitionResult, ITranscript } from "../interfaces"

const client = new speech.v1p1beta1.SpeechClient()

async function trans(operation, transcriptId: string): Promise<ISpeechRecognitionResult[]> {
  return new Promise<ISpeechRecognitionResult[]>((resolve, reject) => {
    operation
      .on("complete", (longRunningRecognizeResponse /*, longRunningRecognizeMetadata, finalApiResponse*/) => {
        // Adding a listener for the "complete" event starts polling for the
        // completion of the operation.

        const speechRecognitionResults = longRunningRecognizeResponse.results as ISpeechRecognitionResult[]
        resolve(speechRecognitionResults)
      })
      .on("progress", async (longRunningRecognizeMetadata /*, apiResponse*/) => {
        // Adding a listener for the "progress" event causes the callback to be
        // called on any change in metadata when the operation is polled.

        const percent = longRunningRecognizeMetadata.progressPercent
        if (percent !== undefined) {
          try {
            await database.setPercent(transcriptId, percent)
          } catch (error) {
            console.log(transcriptId, "Error in on.('progress')")
            console.error(transcriptId, error)
          }
        }
        console.log(transcriptId, "progressPercent", longRunningRecognizeMetadata.progressPercent /*, apiResponse*/)
      })
      .on("error", (error: Error) => {
        // Adding a listener for the "error" event handles any errors found during polling.
        reject(error)
      })
  })
}

export async function transcribe(transcriptId: string, transcript: ITranscript, uri: string): Promise<ISpeechRecognitionResult[]> {
  if (!transcript.metadata || !transcript.metadata.languageCodes || transcript.metadata.languageCodes.length === 0) {
    throw new Error("Language codes missing")
  }

  const languageCode = transcript.metadata.languageCodes.shift()!
  const enableAutomaticPunctuation = languageCode === "en-US" // Only working for en-US at the moment

  const recognitionMetadata: IRecognitionMetadata = {
    audioTopic: transcript.metadata.audioTopic, // An arbitrary description of the subject matter discussed in the audio file. Examples include "Guided tour of New York City," "court trial hearing," or "live interview between 2 people."
    industryNaicsCodeOfAudio: transcript.metadata.industryNaicsCodeOfAudio, // The industry vertical of the audio file, as a 6-digit NAICS code.
    interactionType: transcript.metadata.interactionType, // The use case of the audio.
    microphoneDistance: transcript.metadata.microphoneDistance, // The distance of the microphone from the speaker.
    originalMediaType: transcript.metadata.originalMediaType, // The original media of the audio, either audio or video.
    originalMimeType: transcript.metadata.originalMimeType, // The MIME type of the original audio file. Examples include audio/m4a, audio/x-alaw-basic, audio/mp3, audio/3gpp, or other audio file MIME type.
    recordingDeviceName: transcript.metadata.recordingDeviceName, // The device used to make the recording. This arbitrary string can include names like 'Pixel XL', 'VoIP', 'Cardioid Microphone', or other value.
    recordingDeviceType: transcript.metadata.recordingDeviceType, // The kind of device used to capture the audio, including smartphones, PC microphones, vehicles, etc.
  }

  const recognitionRequest: ILongRunningRegonize = {
    audio: { uri },
    config: {
      enableAutomaticPunctuation,
      enableWordConfidence: true,
      enableWordTimeOffsets: true,
      languageCode,
      metadata: recognitionMetadata,
      speechContexts: transcript.metadata.speechContexts,
      useEnhanced: true,
    },
  }

  if (transcript.metadata.languageCodes.length > 0) {
    recognitionRequest.config.alternativeLanguageCodes = transcript.metadata.languageCodes
  }

  console.log(transcriptId, "Start transcribing", recognitionRequest)

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.

  const responses = await client.longRunningRecognize(recognitionRequest)

  const operation = responses[0]

  console.log(transcriptId, "operation", operation)

  const speechRecognitionResults = await trans(operation, transcriptId)

  return speechRecognitionResults
}
