import firebaseMock from "firebase-mock"
jest.mock("../firebaseApp", () => {
  return firebaseMock
})
import * as React from "react"
import Upload from "../components/Upload"
import * as TestRenderer from "react-test-renderer"

test("renders correctly", () => {
  const testRenderer = TestRenderer.create(<Upload />)

  expect(testRenderer.toJSON()).toMatchSnapshot()
})
