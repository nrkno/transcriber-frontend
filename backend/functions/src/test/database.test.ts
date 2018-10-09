import admin from "firebase-admin"
require("firebase-functions-test")(
  {
    databaseURL: "https://nrk-transkribering-development.firebaseio.com",
    projectId: "nrk-transkribering-development",
    storageBucket: "nrk-transkribering-development.appspot.com",
  },
  "./src/test/serviceAccountKey.json",
)
import database from "../database"
import { Status } from "../enums"
import serializeError from "serialize-error"
import { IWord } from "../interfaces"

test("Set duration in seconds", async function() {
  expect.assertions(1)
  await database.setDurationInSeconds("test", 1234)
  const dataSnapshot = await admin
    .database()
    .ref("transcripts/test/audioFile/durationInSeconds")
    .once("value")

  const value = dataSnapshot.val()
  expect(value).toBe(1234)
})

test("Update status", async function() {
  expect.assertions(1)
  await database.updateStatus("test", Status.Analysing)
  const dataSnapshot = await admin
    .database()
    .ref("transcripts/test/progress/status")
    .once("value")

  const value = dataSnapshot.val()
  expect(value).toBe(Status.Analysing)
})

test("Update percent", async function() {
  expect.assertions(1)
  await database.updatePercent("test", 50)
  const dataSnapshot = await admin
    .database()
    .ref("transcripts/test/progress/percent")
    .once("value")

  const value = dataSnapshot.val()
  expect(value).toBe(50)
})

test("Add words", async function() {
  expect.assertions(2)

  const words1: Array<IWord> = [
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

  const words2: Array<IWord> = [
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

test("Error occured", async function() {
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

afterAll(async function() {
  // Delete all data in "transcripts/test"

  await admin
    .database()
    .ref("transcripts/test")
    .set("")

  // Remove connection, this is needed for the async functions and Jest to work
  admin.app().delete()
})
