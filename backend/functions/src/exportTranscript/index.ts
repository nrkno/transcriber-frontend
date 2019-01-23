import * as functions from "firebase-functions"
import serializeError from "serialize-error"
import ua from "universal-analytics"
import database from "../database"
import docx from "./docx"
import xmp from "./xmp"

async function exportTranscript(request: functions.Request, response: functions.Response) {
  // ----------------
  // Google analytics
  // ----------------

  const accountId = functions.config().analytics.account_id

  if (!accountId) {
    console.warn("Google Analytics account ID missing")
  }

  const visitor = ua(accountId)

  try {
    const id = request.query.id

    if (!id) {
      throw new Error("Transcript id missing")
    }

    const transcript = await database.getTranscript(id)

    // Setting user id
    visitor.set("uid", transcript.userId)

    const results = await database.getResults(id)

    const type = request.query.type

    if (type === "docx") {
      await docx(transcript, results, response)
      visitor.event("transcript", "exported", type).send()
    } else if (type === "xmp") {
      xmp(transcript, results, response)
      visitor.event("transcript", "exported", type).send()
    } else {
      throw new Error(`Unknown type: ${type}`)
    }
  } catch (error) {
    // Log error to console
    console.error(error)

    // Log error to Google Analytics
    visitor.exception(error.message, true).send()

    response.status(500).send(serializeError(error))
  }
}

export default exportTranscript
