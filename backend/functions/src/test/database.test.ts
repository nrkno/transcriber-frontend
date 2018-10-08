import admin from "firebase-admin"
const test = require("firebase-functions-test")(
  {
    databaseURL: "https://nrk-transkribering-development.firebaseio.com",
    projectId: "nrk-transkribering-development",
    storageBucket: "nrk-transkribering-development.appspot.com",
  },
  "./src/test/serviceAccountKey.json",
)
import database from "../database"

it("Set duration in seconds", async function() {
  expect.assertions(1)
  await database.setDurationInSeconds("test", 1234)
  const createdSnap = await admin
    .database()
    .ref("transcripts/test/audioFile/durationInSeconds")
    .once("value")

  const value = createdSnap.val()
  expect(value).toBe(1234)
})

afterAll(() => {
  const app = admin.app()

  //app.database().goOffline()
  app.delete()
})
