const firebaseMock = require("firebase-mock")
const mockDatabase = new firebaseMock.MockFirebase()
jest.mock("../firebaseApp", () => {
  const mockStorage = new firebaseMock.MockStorage()
  const mockSdk = new firebaseMock.MockFirebaseSdk(
    // use null if your code does not use RTDB
    (path: string) => {
      return path ? mockDatabase.child(path) : mockDatabase
    },
    // use null if your code does not use AUTHENTICATION
    () => {
      return null
    },
    // use null if your code does not use FIRESTORE
    () => {
      return null
    },
    // use null if your code does not use STORAGE
    () => {
      return mockStorage
    },
    // use null if your code does not use MESSAGING
    () => {
      return null
    },
  )

  // return the mock to match the export api
  return { database: mockSdk.database(), storage: mockSdk.storage }
})

import * as React from "react"
import Transcript from "../components/Transcript"
import * as TestRenderer from "react-test-renderer"
import { waitForElement, render, /*wait, */ cleanup } from "react-testing-library"
// import { Status } from "../enums"

jest.mock("react-ga")

test("renders correctly", () => {
  const mock: any = jest.fn()
  const match = { params: { id: "" }, isExact: false, path: "", url: "" }
  const testRenderer = TestRenderer.create(<Transcript match={match} location={mock} history={mock} />)
  expect(testRenderer.toJSON()).toMatchSnapshot()
})

test("show loading text", async () => {
  const mock: any = jest.fn()
  const match = { params: { id: "" }, isExact: false, path: "", url: "" }

  const { getByText } = render(<Transcript match={match} location={mock} history={mock} />)

  await waitForElement(() => getByText("Laster inn transkripsjon"))
})

test("show transcription not found on invalid id", async () => {
  const mock: any = jest.fn()
  const match = { params: { id: "" }, isExact: false, path: "", url: "" }

  const { getByText } = render(<Transcript match={match} location={mock} history={mock} />)

  mockDatabase.ref.child("/transcripts").push() //Pushing empty object, will result in transaction === null
  mockDatabase.ref.flush()

  await waitForElement(() => getByText("Fant ikke transkripsjonen"))
})
/*
test("show transcription error", async () => {
  const mock: any = jest.fn()
  const match = { params: { id: "" }, isExact: false, path: "", url: "" }

  const { getByText } = render(<Transcript match={match} location={mock} history={mock} />)
  const transcript: any = {
    audioFile: { url: "", name: "" },
    progress: {
      status: Status.Analysing,
    },
    //error: { message: "TEST" },
  }
  mockDatabase.ref.child("/transcripts").push(transcript)
  mockDatabase.ref.flush()

  await wait(() => getByText("Analyserer"))
})
*/
// automatically unmount and cleanup DOM after the test is finished.
afterEach(() => {
  cleanup()
})
