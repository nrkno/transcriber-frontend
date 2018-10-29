// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app"

// These imports load individual services into the firebase namespace.
import "firebase/auth"
import "firebase/database"
import "firebase/functions"
import "firebase/storage"

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: "nrk-transkribering-development",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  authDomain: "nrk-transkribering-development.firebaseapp.com",
}

firebase.initializeApp(config)

const database = firebase.database()
const storage = firebase.storage()
const auth = firebase.auth()
const functions = firebase.app().functions("europe-west1")

export { auth, database, storage, functions }
