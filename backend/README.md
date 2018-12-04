# Set up

- Create a [Firebase project](https://console.firebase.google.com/)
- Turn on the Firestore database and Storage.
- Edit `.firebaserc` with the name of your Firebase project.
- Install the Firebase CLI: `npm install -g firebase-tools`
- Use the default bucket in Firebase Storage, or create a new one, and set up environment variables with the name of the bucket you just created, along with your Google Analytics account ID: `firebase functions:config:set bucket.name="name-of-bucket" analytics.account_id="UA-XXXXXX-XX"`
- Enable the [Google Speech API](https://console.developers.google.com/apis/api/speech.googleapis.com/overview).
- After deploying the cloud function for the first time, you might want to increase the memory allocation to 2 GB and the timeout to 540 seconds.

## Testing

Create a `.env` file in the `test` folder with the following attributes:

```
FIREBASE_DATABASE_URL = https:...
FIREBASE_UPLOADS_BUCKET = name-of-uploads-bucket
FIREBASE_TRANSCODED_BUCKET = name-of-transcoded-bucket
```

## Deployment

```sh
npm run deploy
```

## Google Analytics

Exceptions are logged.

### Transcription

#### Custom dimensions

- cd1: Language codes
- cd2: Original mime type
- cd3: Industry naics code of audio
- cd4: Interaction type
- cd5: Microphone distance
- cd6: Original media type
- cd7: Recording device name
- cd8: Recording device type

#### Custom metrics

- cm1: Number of audio topic words
- cm2: Number of speech contexts phrases
- cm3: Audio duration
- cm5: Number of words
- cm6: Transcoding duration
- cm7: Transcribing duration
- cm8: Saving duration
- cm9: Process duration (transcoding + transcribing + saving)

#### Events

- transcription -> transcoded -> transcriptId
- transcription -> transcribed -> transcriptId
- transcription -> saved -> transcriptId
- transcription -> done -> transcriptId (audioDuration)

#### User timings

- transcription -> transcoding
- transcription -> transcribing
- transcription -> saving

### Export to Doc

#### Events

transcript -> export generated -> docx
