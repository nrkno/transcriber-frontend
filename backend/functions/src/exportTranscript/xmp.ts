import * as functions from "firebase-functions"
import xmlbuilder from "xmlbuilder"
import { IResult, ITranscript } from "../interfaces"

function xmp(transcript: ITranscript, results: IResult[], response: functions.Response) {
  const fps = 25

  const markers = results.map(result => {
    const words = result.words.map(word => word.word).join(" ")
    const startTime = (result.startTime || 0) * 1e-9
    const duration = result.words[result.words.length - 1].endTime * 1e-9 - startTime
    const marker = {
      "@rdf:parseType": "Resource",
      "xmpDM:comment": words,
      "xmpDM:duration": duration * fps,
      "xmpDM:startTime": startTime * fps,
    }

    return marker
  })

  const data = {
    "x:xmpmeta": {
      "@xmlns:x": "adobe:ns:meta/",
      "rdf:RDF": {
        "@xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdf:Description": {
          "@xmlns:xmpDM": "http://ns.adobe.com/xmp/1.0/DynamicMedia/",
          "xmpDM:Tracks": {
            "rdf:Bag": {
              "rdf:li": {
                "@rdf:parseType": "Resource",
                "xmpDM:frameRate": `f${fps}`,
                "xmpDM:markers": {
                  "rdf:Seq": {
                    "rdf:li": markers,
                  },
                },
                "xmpDM:trackName": "Comment",
                "xmpDM:trackType": "Comment",
              },
            },
          },
        },
      },
    },
  }

  const xml = xmlbuilder.create(data, { encoding: "utf-8" }).end({ pretty: true })

  response.setHeader("Content-Disposition", `attachment; filename=${transcript.name}.${transcript.metadata ? transcript.metadata.fileExtension : ""}.xmp`)
  response.send(Buffer.from(xml))
}

export default xmp
