import * as firebase from "firebase"

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
}

firebase.initializeApp(config)

const db = firebase.database()
const storage = firebase.storage()

export default { db, storage }
