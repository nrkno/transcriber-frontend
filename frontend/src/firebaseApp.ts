// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app"

// These imports load individual services into the firebase namespace.
import "firebase/firestore"
import "firebase/functions"
import "firebase/storage"

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
}

firebase.initializeApp(config)

const database = firebase.firestore()
const settings = { timestampsInSnapshots: true }
database.settings(settings)
const storage = firebase.storage()
const functions = firebase.app().functions("europe-west1")

export { database, storage, functions }
