/**
 * @file Saves transcrips to database
 * @author Andreas Schjønhaug
 */

import { start } from "repl"
import database from "../database"
import { IResult, ISpeechRecognitionResult, IWord } from "../interfaces"

export async function saveResult(speechRecognitionResults: any, id: string) {
  console.log("length", speechRecognitionResults.length)

  for (const index of speechRecognitionResults.keys()) {
    const recognitionResult = speechRecognitionResults[index].alternatives[0] as ISpeechRecognitionResult

    const words = recognitionResult.words.map(wordInfo => {
      let startTime = 0
      if (wordInfo.startTime) {
        if (wordInfo.startTime.seconds) {
          startTime = parseInt(wordInfo.startTime.seconds, 10) * 1e9
        }
        if (wordInfo.startTime.nanos) {
          startTime += wordInfo.startTime.nanos
        }
      }
      let endTime = 0
      if (wordInfo.endTime) {
        if (wordInfo.endTime.seconds) {
          endTime = parseInt(wordInfo.endTime.seconds, 10) * 1e9
        }
        if (wordInfo.endTime.nanos) {
          endTime += wordInfo.endTime.nanos
        }
      }

      const word: IWord = {
        endTime,
        startTime,
        word: wordInfo.word,
      }

      return word
    })

    // Transform startTime and endTime's seconds and nanos
    const result: IResult = {
      confidence: recognitionResult.confidence,
      startTime: words[0].startTime,
      transcript: recognitionResult.transcript,
      words,
    }

    await database.addResult(id, result)

    const percent = Math.round(((index + 1) / speechRecognitionResults.length) * 100)

    if (index + 1 < speechRecognitionResults.length) {
      await database.setPercent(id, percent)
    }
  }
}
