import update from "immutability-helper"
import { Action } from "redux"
import { IWord } from "../../interfaces"

const initState = {}

const resultReducer = (state = initState, action: Action) => {
  switch (action.type) {
    case "RESULT_READ":
      console.log("action.payload", action.payload)

      return {
        results: action.payload,
      }

    case "UPDATE_WORDS":
      const { recalculate, resultIndex, wordIndexEnd, wordIndexStart, words } = action

      console.log("UPDATE_WORD reducer", resultIndex, wordIndexStart, wordIndexEnd, words, recalculate)

      const newWords = Array<IWord>()

      if (recalculate === false) {
        //
        // No recalculation
        //

        for (const [index, word] of words.entries()) {
          console.log(index, word)

          newWords.push({
            confidence: 1,
            endTime: state.results[resultIndex].words[wordIndexEnd + index].endTime,
            startTime: state.results[resultIndex].words[wordIndexStart + index].startTime,
            word,
          })
        }
      } else {
        //
        // Recalculation
        //

        const textLengthWithoutSpaces = words.join("").length

        const wordStart = state.results[resultIndex].words[wordIndexStart]
        const wordEnd = state.results[resultIndex].words[wordIndexEnd]

        if (textLengthWithoutSpaces === 0) {
          // Delete words
          console.log("HSOULD DELETE")
          this.deleteWords(resultIndex, wordIndexStart, wordIndexEnd, true)
          return
        }

        console.log("textLengthWithoutSpaces", textLengthWithoutSpaces)

        const nanosecondsPerCharacter = (wordEnd.endTime - wordStart.startTime) / textLengthWithoutSpaces
        console.log("nanosecondsPerCharacter", nanosecondsPerCharacter)

        let startTime = wordStart.startTime
        for (const word of words) {
          const duration = word.length * nanosecondsPerCharacter
          const endTime = startTime + duration

          newWords.push({
            confidence: 1,
            endTime,
            startTime,
            word,
          })

          startTime = endTime
        }

        // If original entered string ends with a space, we add it to the last word again
        /*TODO
        if (text.endsWith(" ")) {
          cleanText += " "
          newWords[newWords.length - 1].word += " "
        }
*/
        // Replace array of words in result

        /*this.setState({
          currentSelectedWordIndexEnd: wordIndexStart + newWords.length - 1,
          editString: cleanText,
          // TODO resultIndecesWithChanges,
          results: newResults,
        })*/
      }

      console.log("newWords", newWords)

      // Replace array of words in correct position

      console.log("erstter fra ", wordIndexStart)
      console.log("lengde som skal erstates", wordIndexEnd - wordIndexStart + 1)

      const results = update(state.results, {
        [resultIndex]: {
          words: { $splice: [[wordIndexStart, wordIndexEnd - wordIndexStart + 1, ...newWords]] },
        },
      })

      console.log("resultatene", results)

      /*TODO const resultIndecesWithChanges = update(this.state.resultIndecesWithChanges, {
      [resultIndex]: { $set: true },
    })*/

      return {
        results,
      }

    default:
      return state
  }
}

export default resultReducer
