/*


// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app"

// These imports load individual services into the firebase namespace.
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"
import "firebase/storage"

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "nrk-transkribering-development.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
}

firebase.initializeApp(config)

const auth = firebase.auth()
const database = firebase.firestore()
const functions = firebase.app().functions("europe-west1")
const storage = firebase.storage()

export { auth, database, functions, storage }
export default firebase


*/
