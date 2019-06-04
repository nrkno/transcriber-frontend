# Transcriber

Transcriber is a web app using Google speech-to-text API for transcribing audio files. Transcoding, transcription and database is handled by Cloud functions and Firebase, while React JS is used for the web frontend.

## Tech overview

- [React JS](https://reactjs.org)
- [Redux](https://redux.js.org)
- [Google Cloud Storage](https://cloud.google.com/storage/)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/)
- [Cloud Speech-to-text](https://cloud.google.com/speech-to-text/)
- [Cloud Firestore](https://firebase.google.com/docs/firestore/)

## Set up

- Follow the steps in setting up the [backend](https://github.com/nrkno/transcriber-backend).
- Rename `.env.sample` to `.env`
- In the Firebase Console, Choose "Add Firebase to your web project" copy the values of `apiKey`, `databaseURL`, and the name of your uploads bucket and paste them in to `.env`.
- Run `npm install` to install dependencies.

## Development

```sh
npm run dev
```

## Google Analytics

To track events to [Google Analytics](https://analytics.google.com/analytics/web), enter your `GOOGLE_ANALYTICS_PROPERTY_ID` in the `.env` file. The following events are tracked:

### All pages

| category       | action                 | label |
| -------------- | ---------------------- | ----- |
| authentication | log out button pressed |       |

### Create transcript

| category   | action        | label         |
| ---------- | ------------- | ------------- |
| transcript | upload failed | [file format] |
| transcript | aborted       |               |

### Transcript page

| category   | action                | label  |
| ---------- | --------------------- | ------ |
| transcript | export button pressed | [type] |
| transcript | delete button pressed |        |
| player     | play button pressed   |        |
| player     | pause button pressed  |        |
| player     | volume changed        |        |
| editor     | start time changed    |        |
| editor     | speaker name set      |        |
| editor     | speaker name changed  |        |
| editor     | paragraphs joined     |        |
| editor     | paragraphs split      |        |
| editor     | words changed         |        |
| editor     | words deleted         |        |
| editor     | undo                  |        |
| editor     | redo                  |        |

## Browsers targeted

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
