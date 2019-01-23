# Set up

- Create a [Firebase project](https://console.firebase.google.com/)
- Turn on the Firestore database and Storage.
- Edit `.firebaserc` with the name of your Firebase project.
- Install the Firebase CLI: `npm install -g firebase-tools`
- Use the default bucket in Firebase Storage, or create a new one, and set up environment variables with the name of the bucket you just created, along with your Google Analytics account ID:

```
firebase functions:config:set \
analytics.account_id="UA-XXXXXX-XX" \
bucket.name="name-of-bucket" \
sendgrid.apikey="api key" \
sendgrid.email="you@email.com" \
sendgrid.name="Your name" \
webserver.domainname="https://www.example.com"

```

- Enable the [Google Speech API](https://console.developers.google.com/apis/api/speech.googleapis.com/overview).

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
- cd2: Original MIME type
- cd3: Industry NAICS code of audio
- cd4: Interaction type
- cd5: Microphone distance
- cd6: Original media type
- cd7: Recording device name
- cd8: Recording device type

#### Custom metrics

- cm1: Number of audio topic words
- cm2: Number of speech contexts phrases
- cm3: Audio duration
- cm4: Number of words
- cm5: Transcoding duration
- cm6: Transcribing duration
- cm7: Saving duration
- cm8: Process duration (transcoding + transcribing + saving)
- cm9: Confidence

#### Events

| Category      | Action      | Label         | Value          |
| ------------- | ----------- | ------------- | -------------- |
| transcription | transcoded  | transcript id |                |
| transcription | transcribed | transcript id |                |
| transcription | saved       | transcript id |                |
| transcription | done        | transcript id | audio duration |

#### User timings

- transcription → transcoding
- transcription → transcribing
- transcription → saving

### Export

#### Events

| Category   | Action             | Label         |
| ---------- | ------------------ | ------------- |
| transcript | exported           | [type]        |
| transcript | deleted            | step          |
| email      | transcription done | transcript id |
