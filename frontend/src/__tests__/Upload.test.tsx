import firebaseMock from "firebase-mock"
jest.mock("../firebaseApp", () => {
  return firebaseMock
})
import * as React from "react"
import Upload from "../components/Upload"
import * as TestRenderer from "react-test-renderer"
import { render, wait, cleanup, fireEvent } from "react-testing-library"

beforeAll(() => {
  // Dropzone will fail unless we redefine window.URL.createObjectURL
  Object.defineProperty(window.URL, "createObjectURL", {
    value: () => {},
  })
})

test("renders correctly", () => {
  const testRenderer = TestRenderer.create(<Upload />)

  expect(testRenderer.toJSON()).toMatchSnapshot()
})

test("submit button is disabled", () => {
  const { getByText } = render(<Upload />)
  const submitButton = getByText("Last opp") as HTMLButtonElement

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

test("dropping files that are not audio will display error", async () => {
  const { getByText } = render(<Upload />)

  const dropzone = getByText("Klikk for å velge, eller slipp lydfil her")
  const file = new File(["Content"], "image1.jpg", { type: "image/jpg" })
  Object.defineProperty(dropzone, "files", { value: [file] })

  fireEvent.drop(dropzone)

  const submitButton = getByText("Last opp") as HTMLButtonElement
  await wait(() => {
    expect(dropzone.textContent).toBe("Filen har feil format")
    expect(submitButton.disabled).toEqual(true)
  })
})

test("dropping files on dropzone should show file name and enable upload button", async () => {
  const { getByText } = render(<Upload />)

  const dropzone = getByText("Klikk for å velge, eller slipp lydfil her")
  const submitButton = getByText("Last opp") as HTMLButtonElement

  const file = new File(["Content"], "audio.mp3", { type: "audio/mp3" })
  Object.defineProperty(dropzone, "files", { value: [file] })

  fireEvent.drop(dropzone)

  await wait(() => {
    expect(dropzone.textContent).toBe("audio.mp3")
    expect(submitButton.disabled).toEqual(false)

    expect(submitButton).toHaveProperty("disabled", false)
  })
})

// automatically unmount and cleanup DOM after the test is finished.
afterEach(() => {
  cleanup()
})
