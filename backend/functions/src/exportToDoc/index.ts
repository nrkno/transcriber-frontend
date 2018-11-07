import { Document, Packer, Paragraph } from "docx"
import * as functions from "firebase-functions"
import database from "../database"

async function exportToDoc(id: string, response: functions.Response) {
  console.log(id)

  const text = await database.downloadText(id)

  const results = text.val()

  const doc = new Document()

  Object.values(results).map((result, i) => {
    let seconds = 0

    if (result[0].startTime && result[0].startTime.seconds) {
      seconds = parseInt(result[0].startTime.seconds, 10)
    }

    const startTime = new Date(seconds * 1000).toISOString().substr(11, 8)

    if (i > 0) {
      doc.addParagraph(new Paragraph())
      doc.addParagraph(new Paragraph(startTime))
      doc.addParagraph(new Paragraph())
    }

    const words = Object.values(result)
      .map(word => word.word)
      .join(" ")

    doc.addParagraph(new Paragraph(words))
  })

  const packer = new Packer()

  const b64string = await packer.toBase64String(doc)
  response.setHeader("Content-Disposition", "attachment; filename=Transcript.docx")
  response.send(Buffer.from(b64string, "base64"))
}

export default exportToDoc
