# Set up

- Create two [Firebase projects](https://console.firebase.google.com/), one for development and another for production.
- Turn on the Firebase Realtime Database and Storage.
- Create two buckets in Firebase Storage, one for uploads and another for transcoded audio files.
- Edit `.firebaserc` with the name of your Firebase projects.
- Install the Firebase CLI: `npm install -g firebase-tools`
- Set up environment variables with the names of the two buckets you just created: `firebase functions:config:set bucket.uploads="name-of-uploads-bucket" bucket.transcoded="name-of-transcoded-bucket"`
- Turn on Google Speech API in the [Google Cloud console](https://console.cloud.google.com).
- After deploying the cloud function for the first time, you might want to increase the memory allocation to 2 GB and the timeout to 540 seconds.

## Testing

To run the tests, you need a service account. See [Initialize SDK in online mode](https://firebase.google.com/docs/functions/unit-testing#initializing), and save the file as `serviceAccountKey.json` in the `test` folder. You also need to create a `.env` file the following attributes:

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
