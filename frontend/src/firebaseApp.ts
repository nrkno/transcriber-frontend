// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app"

// These imports load individual services into the firebase namespace.
import "firebase/storage"
import "firebase/database"
import "firebase/functions"

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
}

firebase.initializeApp(config)

const database = firebase.database()
const storage = firebase.storage()
const functions = firebase.app().functions("europe-west1")

export { database, storage, functions }
