/**
 * @file Saves transcrips to database
 * @author Andreas Schjønhaug
 */

import database from "./database"

export async function saveResult(speechRecognitionResults: any, id: string) {
  console.log("length", speechRecognitionResults.length)

  // Flattening the structure

  for (const index of speechRecognitionResults.keys()) {
    const words = speechRecognitionResults[index].alternatives[0].words

    await database.addWords(id, words)

    const percent = Math.round(((index + 1) / speechRecognitionResults.length) * 100)

    if (index + 1 < speechRecognitionResults.length) {
      await database.updatePercent(id, percent)
    }
  }
}
