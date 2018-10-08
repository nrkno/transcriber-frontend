import { hoursMinutesSecondsToSeconds } from "../helpers"

test("One hour is 3600 seconds", () => {
  expect(hoursMinutesSecondsToSeconds("1:00:00")).toBe(3600)
})
