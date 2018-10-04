# Set up

- Follow the steps in setting up the backend.
- In the Firebase Console, Choose "Add Firebase to your web project" copy the values of `apiKey`, `databaseURL`, and the name of your uploads bucket and paste them in to `development.env` and `production.env`.
- Run `npm install` to install dependencies.

## Development

```sh
npm start
```

## Deployment

```sh
firebase deploy
```

# Google Analytics

To track events to [Google Analytics](https://analytics.google.com/analytics/web), enter your `GOOGLE_ANALYTICS_PROPERTY_ID` in the correspoindg `.env` file. The following events are tracked:

## Upload page

- Upload
  - Wrong file format

## Result page

- Transcription

  - Not found

- Process

  - Analysing
  - Transcoding
  - Transcribing
  - Saving
  - Success
  - Failed

- Player
  - Play button pressed
  - Pause button pressed
  - Volume changed

# Browsers targeted

```sh
npx browserslist ">0.25% in my stats, not IE > 0"

chrome 69
chrome 68
chrome 67
edge 17
edge 16
firefox 61
ios_saf 11.3-11.4
safari 11.1
safari 11
```
