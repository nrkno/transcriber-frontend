export function hoursMinutesSecondsToSeconds(duration: string): number {
  const [hours, minutes, seconds] = duration.split(":")

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds)
}
