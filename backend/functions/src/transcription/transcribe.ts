/**
 * @file Transcripts audio with Google Speech
 * @author Andreas Schjønhaug
 */

import speech from "@google-cloud/speech"
import database from "../database"
import { ILongRunningRegonize, ISpeechRecognitionResult, ITranscript } from "../interfaces"

const client = new speech.v1p1beta1.SpeechClient()

async function trans(operation, id: string): Promise<ISpeechRecognitionResult[]> {
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
            await database.setPercent(id, percent)
          } catch (error) {
            console.log("Error in on.('progress')")
            console.error(error)
          }
        }
        console.log("progress", longRunningRecognizeMetadata /*, apiResponse*/)
      })
      .on("error", (error: Error) => {
        // Adding a listener for the "error" event handles any errors found during polling.
        reject(error)
      })
  })
}

export async function transcribe(id: string, transcript: ITranscript, uri: string): Promise<ISpeechRecognitionResult[]> {
  if (!transcript.metadata || !transcript.metadata.languageCodes || transcript.metadata.languageCodes.length === 0) {
    throw new Error("Language codes missing")
  }

  const languageCode = transcript.metadata.languageCodes.shift()!
  const enableAutomaticPunctuation = languageCode === "en-US" // Only working for en-US at the moment

  const recognitionRequest: ILongRunningRegonize = {
    audio: { uri },
    config: {
      enableAutomaticPunctuation,
      enableWordTimeOffsets: true,
      languageCode,
      metadata: transcript.metadata,
      useEnhanced: true,
    },
  }

  if (transcript.metadata.languageCodes.length > 0) {
    recognitionRequest.config.alternativeLanguageCodes = transcript.metadata.languageCodes
  }

  console.log("Start transcribing", id, recognitionRequest)

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.

  const responses = await client.longRunningRecognize(recognitionRequest)

  const operation = responses[0]

  console.log("operation", operation)

  const speechRecognitionResults = await trans(operation, id)

  return speechRecognitionResults
}
