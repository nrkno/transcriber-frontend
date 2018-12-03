import { Document, Packer, Paragraph } from "docx"
import * as functions from "firebase-functions"
import serializeError from "serialize-error"
import ua from "universal-analytics"
import database from "../database"

async function exportToDoc(request: functions.Request, response: functions.Response) {
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

    const results = await database.getResults(id)

    const doc = new Document()

    Object.values(results).map((result, i) => {
      if (i > 0) {
        const seconds = result.startTime || 0
        const startTime = new Date(seconds * 1000).toISOString().substr(11, 8)
        doc.addParagraph(new Paragraph())
        doc.addParagraph(new Paragraph(startTime))
        doc.addParagraph(new Paragraph())
      }

      const words = result.words.map(word => word.word).join(" ")

      doc.addParagraph(new Paragraph(words))
    })

    const packer = new Packer()

    const b64string = await packer.toBase64String(doc)
    response.setHeader("Content-Disposition", "attachment; filename=Transcript.docx")
    response.send(Buffer.from(b64string, "base64"))
    visitor.event("transcript", "export generated", "docx").send()
  } catch (error) {
    // Log error to console
    console.error(error)

    // Log error to Google Analytics
    visitor.exception(error.message, true).send()

    response.status(500).send(serializeError(error))
  }
}

export default exportToDoc
