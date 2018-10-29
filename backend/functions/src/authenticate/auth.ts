/**
 * @file Sets up auth
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

export const auth = admin.auth()
