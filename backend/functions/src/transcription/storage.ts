/**
 * @file Sets up Storage
 * @author Andreas Schjønhaug
 */

import admin from "firebase-admin"
import * as functions from "firebase-functions"

// Only initialise the app once
if (!admin.apps.length) {
  admin.initializeApp(functions.config().firebase)
} else {
  admin.app()
}

const storage = admin.storage()

// Getting the bucket reference from Google Cloud Runtime Configuration API
export const bucketName = functions.config().bucket.name

if (bucketName === undefined) {
  throw Error("Environment variable 'bucket.name' not set up")
}
export const bucket = storage.bucket(bucketName)
