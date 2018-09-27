/**
 * @file Sets up Firebase
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
export const database = admin.database()
export const storage = admin.storage()
export const timestamp = admin.database.ServerValue.TIMESTAMP
