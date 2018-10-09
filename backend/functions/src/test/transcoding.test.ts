const test = require("firebase-functions-test")(
  {
    databaseURL: "https://nrk-transkribering-development.firebaseio.com",
    projectId: "nrk-transkribering-development",
    storageBucket: "nrk-transkribering-development.appspot.com",
  },
  "./src/test/serviceAccountKey.json",
)
test.mockConfig({ bucket: { uploads: "nrk-transkribering-development-uploads", transcoded: "nrk-transkribering-development-transcoded" } })

import { transcode } from "../transcoding"
import ffmpeg from "fluent-ffmpeg"
import { storage } from "../storage"
import * as functions from "firebase-functions"
import fs from "fs"
import os from "os"
import path from "path"

it.only("Transcode", async function(done) {
  //First, we upload the a stereo mp3 file to the uploads bucket

  const fileId = "test"
  const uploadsBucket = storage.bucket(functions.config().bucket.uploads)

  await uploadsBucket.upload(`${__dirname}/${fileId}.mp3`, { destination: "test" })

  expect.assertions(4)

  await transcode(fileId)

  //We download the file and check if it's in FLAC mono with audio frequency 16.000

  const transcodedBucket = storage.bucket(functions.config().bucket.transcoded)
  const tempFilePath = path.join(os.tmpdir(), fileId)

  await transcodedBucket.file(`${fileId}.flac`).download({ destination: tempFilePath })

  ffmpeg.ffprobe(tempFilePath, (error: any, probeData: ffmpeg.FfprobeData) => {
    expect(error).toBeNull()
    expect(probeData.streams[0].codec_name).toBe("flac")
    expect(probeData.streams[0].sample_rate).toBe(16000)
    expect(probeData.streams[0].channels).toBe(1)

    done()
  })
})
