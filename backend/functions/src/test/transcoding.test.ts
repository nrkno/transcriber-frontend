import dotenv from "dotenv"
const result = dotenv.config({ path: "./src/test/.env" })
if (result.error) {
  throw result.error
}

import firebaseFunctionsTest from "firebase-functions-test"
const test = firebaseFunctionsTest({
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})
test.mockConfig({ bucket: { uploads: process.env.FIREBASE_UPLOADS_BUCKET, transcoded: process.env.FIREBASE_TRANSCODED_BUCKET } })

import * as functions from "firebase-functions"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import os from "os"
import path from "path"
import { storage } from "../storage"
import { transcode } from "../transcoding"

it.only("Transcode", async done => {
  // First, we upload the a stereo mp3 file to the uploads bucket

  const fileId = "test"
  const uploadsBucket = storage.bucket(functions.config().bucket.uploads)

  await uploadsBucket.upload(`${__dirname}/${fileId}.mp3`, { destination: "test" })

  expect.assertions(4)

  await transcode(fileId)

  // We download the file and check if it's in FLAC mono with audio frequency 16.000

  const transcodedBucket = storage.bucket(functions.config().bucket.transcoded)
  const tempFilePath = path.join(os.tmpdir(), fileId)

  await transcodedBucket.file(`${fileId}-transcribed`).download({ destination: tempFilePath })

  ffmpeg.ffprobe(tempFilePath, (error: any, probeData: ffmpeg.FfprobeData) => {
    expect(error).toBeNull()
    expect(probeData.streams[0].codec_name).toBe("flac")
    expect(probeData.streams[0].sample_rate).toBe(16000)
    expect(probeData.streams[0].channels).toBe(1)

    done()
  })
})

afterAll(async () => {
  // Delete remote files

  const uploadsBucket = storage.bucket(functions.config().bucket.uploads)
  await uploadsBucket.file("test").delete()

  const transcodedBucket = storage.bucket(functions.config().bucket.transcoded)
  await transcodedBucket.file("test.flac").delete()

  // Delete local file

  const tempFilePath = path.join(os.tmpdir(), "test")
  fs.unlinkSync(tempFilePath)
})
