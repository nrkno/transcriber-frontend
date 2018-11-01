/**
 * @file Saves transcrips to database
 * @author Andreas Schjønhaug
 */

import database from "./database"
import { IResult } from "./interfaces"

export async function saveResult(speechRecognitionResults: any, id: string) {
  console.log(speechRecognitionResults)

  console.log("length", speechRecognitionResults.length)

  // Flattening the structure

  for (const index of speechRecognitionResults.keys()) {
    const result = speechRecognitionResults[index].alternatives[0] as IResult

    console.log(result)

    await database.addResult(id, result)

    const percent = Math.round(((index + 1) / speechRecognitionResults.length) * 100)

    if (index + 1 < speechRecognitionResults.length) {
      await database.setPercent(id, percent)
    }
  }
}
