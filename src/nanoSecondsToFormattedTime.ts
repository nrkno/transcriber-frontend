export default function nanoSecondsToFormattedTime(startTime: number, nanoSeconds: number, showHours: boolean, showCentiSeconds: boolean) {
  const s = (startTime + nanoSeconds) * 1e-9

  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = Math.floor((s % 3600) % 60)
  const centiSeconds = Math.floor((s % 1) * 100)

  const hDisplay = showHours ? (hours > 9 ? `${hours}:` : `0${hours}:`) : ""
  const mDisplay = minutes > 9 ? `${minutes}:` : `0${minutes}:`
  const sDisplay = seconds > 9 ? `${seconds}` : `0${seconds}`
  const csDisplay = showCentiSeconds ? (centiSeconds > 9 ? `:${centiSeconds}` : `:0${centiSeconds}`) : ""

  return hDisplay + mDisplay + sDisplay + csDisplay
}
