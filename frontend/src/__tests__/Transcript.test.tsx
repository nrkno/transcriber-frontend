jest.mock("../firebaseApp", () => {
  const firebasemock = require("firebase-mock")
  const mockdatabase = new firebasemock.MockFirebase()
  const mockstorage = new firebasemock.MockStorage()

  const mocksdk = new firebasemock.MockFirebaseSdk(
    // use null if your code does not use RTDB
    (path: string) => {
      return path ? mockdatabase.child(path) : mockdatabase
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
      return mockstorage
    },
    // use null if your code does not use MESSAGING
    () => {
      return null
    },
  )

  // return the mock to match the export api
  return { database: mocksdk.database(), storage: mocksdk.storage }
})

import * as React from "react"
import Transcript from "../components/Transcript"
import * as TestRenderer from "react-test-renderer"
import { waitForElement, render } from "react-testing-library"
jest.mock("react-ga")

test("renders correctly", () => {
  const mock: any = jest.fn()
  const match = { params: { id: "test" }, isExact: false, path: "", url: "" }
  const testRenderer = TestRenderer.create(<Transcript match={match} location={mock} history={mock} />)
  expect(testRenderer.toJSON()).toMatchSnapshot()
})

test("show loading text", async () => {
  const mock: any = jest.fn()
  const match = { params: { id: "test" }, isExact: false, path: "", url: "" }

  const { getByText } = render(<Transcript match={match} location={mock} history={mock} />)

  await waitForElement(() => getByText("Laster inn transkripsjon"))
})
