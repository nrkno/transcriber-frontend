/**
 * @file Saves transcrips to database
 * @author Andreas Schjønhaug
 */

import database from "../database"
import { IResult, ISpeechRecognitionAlternative, IWord } from "../interfaces"

export async function saveResult(speechRecognitionResults: any, transcriptId: string) {
  for (const index of speechRecognitionResults.keys()) {
    const recognitionResult = speechRecognitionResults[index].alternatives[0] as ISpeechRecognitionAlternative

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
        confidence: wordInfo.confidence,
        endTime,
        startTime,
        word: wordInfo.word,
      }

      return word
    })

    // Transform startTime and endTime's seconds and nanos
    const result: IResult = {
      startTime: words[0].startTime,
      words,
    }

    await database.addResult(transcriptId, result)

    if (index + 1 < speechRecognitionResults.length) {
      const percent = Math.round(((index + 1) / speechRecognitionResults.length) * 100)
      await database.setPercent(transcriptId, percent)
      console.log(transcriptId, "Prosent lagret:" + percent)
    }
  }
}
