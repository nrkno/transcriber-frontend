import { Document, Packer, Paragraph } from "docx"
import * as functions from "firebase-functions"
import { IResult, ITranscript } from "../interfaces"

async function docx(transcript: ITranscript, results: IResult[], response: functions.Response) {
  const doc = new Document()

  Object.values(results).map((result, i) => {
    if (i > 0) {
      doc.addParagraph(new Paragraph())

      const startTimeInSeconds = (result.startTime || 0) * 1e-9 // Nano to seconds
      const startTimeMatchArray = new Date(startTimeInSeconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)

      if (startTimeMatchArray !== null) {
        doc.addParagraph(new Paragraph(startTimeMatchArray[0]))
      }
      doc.addParagraph(new Paragraph())
    }

    const words = result.words.map(word => word.word).join(" ")

    doc.addParagraph(new Paragraph(words))
  })

  const packer = new Packer()

  const b64string = await packer.toBase64String(doc)
  response.setHeader("Content-Disposition", `attachment; filename=${transcript.name}.docx`)
  response.send(Buffer.from(b64string, "base64"))
}

export default docx
