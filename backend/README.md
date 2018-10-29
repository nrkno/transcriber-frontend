# Set up

- Create two [Firebase projects](https://console.firebase.google.com/), one for development and another for production.
- Turn on the Firebase Realtime Database and Storage.
- Create two buckets in Firebase Storage, one for uploads and another for transcoded audio files.
- Edit `.firebaserc` with the name of your Firebase projects.
- Install the Firebase CLI: `npm install -g firebase-tools`
- Set up environment variables
- Turn on Google Speech API in the [Google Cloud console](https://console.cloud.google.com).
- After deploying the cloud function for the first time, you might want to increase the memory allocation to 2 GB and the timeout to 540 seconds.
- On the default service account, add the ["Service Account Token Creator"](https://firebase.google.com/docs/auth/admin/create-custom-tokens#service_account_does_not_have_required_permissions) role.

## Setting up environment variables

First, choose your environment

```sh
firebase use development
```

or

```sh
firebase use production
```

Set environemnt variables for buckets and Azure AD

``sh
firebase functions:config:set
azure_ad.client_id=""
azure_ad.client_secret=""
azure_ad.identity_metadata="https://..."
azure_ad.redirect_url="http://..."
bucket.transcoded="name-of-transcoded-bucket"
bucket.uploads="name-of-uploads-bucket"
session.secret=""

```
Check current environment variables

``sh
firebase functions:config:get
```

## Testing

Create a `.env` file in the `test` folder with the following attributes:

```
FIREBASE_DATABASE_URL = https:...
FIREBASE_UPLOADS_BUCKET = name-of-uploads-bucket
FIREBASE_TRANSCODED_BUCKET = name-of-transcoded-bucket
```

## Deployment

```sh
npm run-script deploy
```
