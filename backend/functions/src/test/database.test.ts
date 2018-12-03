import dotenv from "dotenv"
const result = dotenv.config({ path: "./src/test/.env" })
if (result.error) {
  throw result.error
}

import firebaseFunctionsTest from "firebase-functions-test"
firebaseFunctionsTest({
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})
import admin from "firebase-admin"
import serializeError from "serialize-error"
import database from "../database"
import { Step } from "../enums"
import { IWord } from "../interfaces"

test("Set duration in seconds", async () => {
  expect.assertions(1)
  await database.setDuration("test", 1234)
  const dataSnapshot = await admin
    .database()
    .ref("transcripts/test/audioFile/durationInSeconds")
    .once("value")

  const value = dataSnapshot.val()
  expect(value).toBe(1234)
})

test("Update status", async () => {
  expect.assertions(1)
  await database.setStatus("test", Step.Analysing)
  const dataSnapshot = await admin
    .database()
    .ref("transcripts/test/progress/status")
    .once("value")

  const value = dataSnapshot.val()
  expect(value).toBe(Step.Analysing)
})

test("Update percent", async () => {
  expect.assertions(1)
  await database.setPercent("test", 50)
  const dataSnapshot = await admin
    .database()
    .ref("transcripts/test/progress/percent")
    .once("value")

  const value = dataSnapshot.val()
  expect(value).toBe(50)
})

test("Add words", async () => {
  expect.assertions(2)

  const words1: IWord[] = [
    {
      endTime: {
        nanos: 300000000,
        seconds: "1",
      },
      word: "Hello",
    },
    {
      endTime: {
        nanos: 400000000,
        seconds: "1",
      },
      startTime: {
        nanos: 300000000,
        seconds: "1",
      },
      word: "world",
    },
  ]

  const words2: IWord[] = [
    {
      endTime: {
        nanos: 300000000,
        seconds: "2",
      },

      startTime: {
        nanos: 300000000,
        seconds: "2",
      },
      word: "Foo",
    },
    {
      endTime: {
        nanos: 400000000,
        seconds: "2",
      },
      startTime: {
        nanos: 300000000,
        seconds: "2",
      },
      word: "Bar",
    },
  ]
  await database.addWords("test", words1)
  await database.addWords("test", words2)
  const dataSnapshot = await admin
    .database()
    .ref("transcripts/test/text")
    .once("value")

  const words = Object.values(dataSnapshot.val())

  expect(words.pop()).toEqual(words2)
  expect(words.pop()).toEqual(words1)
})

test("Error occured", async () => {
  expect.assertions(1)

  const error = new Error("Something went wrong!")
  await database.errorOccured("test", error)

  const dataSnapshot = await admin
    .database()
    .ref("transcripts/test/error")
    .once("value")

  const value = dataSnapshot.val()

  const serializedError = serializeError(error)

  expect(value).toEqual(serializedError)
})

afterAll(async () => {
  // Delete all data in "transcripts/test"

  await admin
    .database()
    .ref("transcripts/test")
    .set("")

  // Remove connection, this is needed for the async functions and Jest to work
  await admin.app().delete()
})
