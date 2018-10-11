import firebaseMock from "firebase-mock"
jest.mock("../firebaseApp", () => {
  return firebaseMock
})
import * as React from "react"
import Upload from "../components/Upload"
import * as TestRenderer from "react-test-renderer"
import { render } from "react-testing-library"

test("renders correctly", () => {
  const testRenderer = TestRenderer.create(<Upload />)

  expect(testRenderer.toJSON()).toMatchSnapshot()
})

test("submit button is disabled", () => {
  const { getByTestId } = render(<Upload />)
  const submitButton = getByTestId("submit") as HTMLButtonElement

  expect(submitButton.disabled).toBe(true)
})

test("drop down has Norwegian and English languages", () => {
  const { getByTestId } = render(<Upload />)
  const languagesSelect = getByTestId("languages") as HTMLSelectElement

  expect(languagesSelect.options.length).toBe(2)

  expect(languagesSelect.options[0].text).toBe("Norsk")
  expect(languagesSelect.options[0].value).toBe("nb-NO")

  expect(languagesSelect.options[1].text).toBe("Engelsk")
  expect(languagesSelect.options[1].value).toBe("en-US")
})
