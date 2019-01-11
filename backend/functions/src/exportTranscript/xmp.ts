import * as functions from "firebase-functions"
import xmlbuilder from "xmlbuilder"
import { IResult } from "../interfaces"

function xmp(results: IResult[], response: functions.Response) {
  const markers = results.map(result => {
    const words = result.words.map(word => word.word).join(" ")
    const startTime = (result.startTime || 0) / 10000000
    const duration = 100
    const marker = {
      "@rdf:parseType": "Resource",
      "xmpDM:comment": words,
      "xmpDM:duration": duration,
      "xmpDM:startTime": startTime,
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
                "xmpDM:frameRate": "f100",
                "xmpDM:markers": markers,
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

  response.setHeader("Content-Disposition", "attachment; filename=Transcript.xmp")
  response.send(Buffer.from(xml))
}

export default xmp
