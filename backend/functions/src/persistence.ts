/**
 * @file Saves transcrips to database
 * @author Andreas Schjønhaug
 */

import { database, timestamp } from "./database"
import { updateTranscript } from "./helpers"

export async function saveResult(speechRecognitionResults: any, id: string) {
  console.log("length", speechRecognitionResults.length)

  await updateTranscript(id, {
    progress: {
      percent: 0,
      status: "saving",
    },
    "timestamps/transcribedAt": timestamp,
  })

  // Flattening the structure

  for (const index of speechRecognitionResults.keys()) {
    const words = speechRecognitionResults[index].alternatives[0].words

    database.ref(`/transcripts/${id}/text`).push(JSON.parse(JSON.stringify(words)))

    const percent = Math.round(((index + 1) / speechRecognitionResults.length) * 100)

    if (index + 1 < speechRecognitionResults.length) {
      await updateTranscript(id, {
        "progress/percent": percent,
      })
    } else {
      await updateTranscript(id, {
        progress: { status: "success" },
        "timestamps/savedAt": timestamp,
      })
    }
  }
}
