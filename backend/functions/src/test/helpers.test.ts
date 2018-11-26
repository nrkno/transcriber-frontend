import { hoursMinutesSecondsToSeconds } from "../transcribe/helpers"

test("One hour is 3600 seconds", () => {
  expect(hoursMinutesSecondsToSeconds("1:00:00")).toBe(3600)
})
test("Ten minutes is 600 seconds", () => {
  expect(hoursMinutesSecondsToSeconds("00:10:00")).toBe(600)
})
test("Ten seconds is 10 seconds", () => {
  expect(hoursMinutesSecondsToSeconds("0:00:10")).toBe(10)
})
