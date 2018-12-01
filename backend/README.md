# Set up

- Create two [Firebase projects](https://console.firebase.google.com/), one for development and another for production.
- Turn on the Firebase Realtime Database and Storage.
- Edit `.firebaserc` with the name of your Firebase projects.
- Install the Firebase CLI: `npm install -g firebase-tools`
- Use the default bucket in Firebase Storage, or create a new one, and set up environment variables with the names of the two buckets you just created: `firebase functions:config:set bucket.name="name-of-bucket"`
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
firebase use development (or production)
npm run-script deploy
```

## Google Analytics

### Custom dimensions

- cd1: Language codes
- cd2: Original mime type
- cd3: Industry naics code of audio
- cd4: Interaction type
- cd5: Microphone distance
- cd6: Original media type
- cd7: Recording device name
- cd8: Recording device type

### Custom metrics

- cm1: Number of audio topic words
- cm2: Number of speech contexts phrases
- cm3: Audio duration
- cm4: Number of words

* cm4: Transcoding duration
* cm5: Transcribing duration
* cm6: Saving duration
