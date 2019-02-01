/**
 * @file Saves transcrips to database
 * @author Andreas Schjønhaug
 */

import database from "../database"
import { IResult, ISpeechRecognitionResult, IWord } from "../interfaces"

export async function saveResult(speechRecognitionResults: any, transcriptId: string) {
  for (const index of speechRecognitionResults.keys()) {
    const recognitionResult = speechRecognitionResults[index] as ISpeechRecognitionResult
    const alternative = recognitionResult.alternatives[0]

    console.log(speechRecognitionResults[index])

    const words = alternative.words.map(wordInfo => {
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
      channelTag: recognitionResult.channelTag,
      languageCode: recognitionResult.languageCode,
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
