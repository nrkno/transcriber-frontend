# Set up

- Follow the steps in setting up the backend.
- Rename `.env.sample` to `.env`
- In the Firebase Console, Choose "Add Firebase to your web project" copy the values of `apiKey`, `databaseURL`, and the name of your uploads bucket and paste them in to `.env`.
- Run `npm install` to install dependencies.

## Development

```sh
npm run dev
```

# Google Analytics

To track events to [Google Analytics](https://analytics.google.com/analytics/web), enter your `GOOGLE_ANALYTICS_PROPERTY_ID` in the `.env` file. The following events are tracked:

## All pages

- Authentication
  - log out button pressed

## Upload page

- Upload
  - Wrong file format

## Transcript page

- Transcription

  - Not found

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
