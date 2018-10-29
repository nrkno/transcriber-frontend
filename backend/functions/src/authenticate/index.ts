/******************************************************************************
 * Module dependencies.
 *****************************************************************************/

import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors, { CorsOptions, CorsOptionsDelegate } from "cors"
import express from "express"
import expressSession from "express-session"
import * as functions from "firebase-functions"
import methodOverride from "method-override"
import passport from "passport"
import { OIDCStrategy } from "passport-azure-ad"
import util from "util"
import { auth } from "./auth"
import { credentials, destroySessionUrl } from "./credentials"
/******************************************************************************
 * Set up passport in the app
 ******************************************************************************/

// -----------------------------------------------------------------------------
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
// -----------------------------------------------------------------------------
passport.serializeUser((user, done) => {
  done(null, user.oid)
})

passport.deserializeUser((oid, done) => {
  findByOid(oid, (err, user) => {
    done(err, user)
  })
})

// array to hold logged in users
const users = []

const findByOid = (oid, fn) => {
  for (let i = 0, len = users.length; i < len; i++) {
    const user = users[i]
    console.info("we are using user: ", user)
    if (user.oid === oid) {
      return fn(null, user)
    }
  }
  return fn(null, null)
}

// -----------------------------------------------------------------------------
// Use the OIDCStrategy within Passport.
//
// Strategies in passport require a `verify` function, which accepts credentials
// (in this case, the `oid` claim in id_token), and invoke a callback to find
// the corresponding user object.
//
// The following are the accepted prototypes for the `verify` function
// (1) function(iss, sub, done)
// (2) function(iss, sub, profile, done)
// (3) function(iss, sub, profile, access_token, refresh_token, done)
// (4) function(iss, sub, profile, access_token, refresh_token, params, done)
// (5) function(iss, sub, profile, jwtClaims, access_token, refresh_token, params, done)
// (6) prototype (1)-(5) with an additional `req` parameter as the first parameter
//
// To do prototype (6), passReqToCallback must be set to true in the config.
// -----------------------------------------------------------------------------
passport.use(
  new OIDCStrategy(
    {
      allowHttpForRedirectUrl: credentials.allowHttpForRedirectUrl,
      clientID: credentials.clientID,
      clientSecret: credentials.clientSecret,
      clockSkew: credentials.clockSkew,
      cookieEncryptionKeys: credentials.cookieEncryptionKeys,
      identityMetadata: credentials.identityMetadata,
      isB2C: credentials.isB2C,
      issuer: credentials.issuer,
      loggingLevel: credentials.loggingLevel,
      nonceLifetime: credentials.nonceLifetime,
      nonceMaxAmount: credentials.nonceMaxAmount,
      passReqToCallback: credentials.passReqToCallback,
      redirectUrl: credentials.redirectUrl,
      responseMode: credentials.responseMode,
      responseType: credentials.responseType,
      scope: credentials.scope,
      useCookieInsteadOfSession: credentials.useCookieInsteadOfSession,
      validateIssuer: credentials.validateIssuer,
    },
    (iss, sub, profile, accessToken, refreshToken, done) => {
      if (!profile.oid) {
        return done(new Error("No oid found"), null)
      }
      // asynchronous verification, for effect...
      process.nextTick(() => {
        findByOid(profile.oid, (err, user) => {
          if (err) {
            return done(err)
          }
          if (!user) {
            // "Auto-registration"
            users.push(profile)
            return done(null, profile)
          }
          return done(null, user)
        })
      })
    },
  ),
)

// -----------------------------------------------------------------------------
// Config the app, include middlewares
// -----------------------------------------------------------------------------
const app = express()

// CORS
const whitelist = ["http://localhost:8080", "https://login.microsoftonline.com"]
const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
  let corsOptions: CorsOptions
  let origin: req.header("Origin")
  if (whitelist.indexOf(origin) !== -1) {
    console.log(`Found origin: ${origin}`)

    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    console.log(`Did not find origin: ${origin}`)

    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate))
app.options("*", cors(corsOptionsDelegate))

app.use(methodOverride())
app.use(cookieParser())
app.use(expressSession({ secret: functions.config().session.secret, resave: true, saveUninitialized: false }))
app.use(bodyParser.urlencoded({ extended: true }))

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize())
app.use(passport.session())

// -----------------------------------------------------------------------------
// Set up the route controller
//
// 1. For 'login' route and 'returnURL' route, use `passport.authenticate`.
// This way the passport middleware can redirect the user to login page, receive
// id_token etc from returnURL.
//
// 2. For the routes you want to check if user is already logged in, use
// `ensureAuthenticated`. It checks if there is an user stored in session, if not
// it will call `passport.authenticate` to ask for user to log in.
// -----------------------------------------------------------------------------
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

app.get("/", (req, res) => {
  console.log(req.user)

  res.send(`Hello World!!! ${req.user.upn} ${req.user.oid}`)
})

// '/account' is only available to logged in user
app.get("/account", ensureAuthenticated, (req, res) => {
  res.render("account", { user: req.user })
})

app.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("azuread-openidconnect", {
      // customState: "my_state", // optional. Provide a value if you want to provide custom state value.
      failureRedirect: "/",
      // resourceURL: config.resourceURL, // optional. Provide a value if you want to specify the resource.
      response: res, // required
    })(req, res, next)
  },
  (req, res) => {
    console.info("Login was called in the Sample")
    res.redirect("/authenticate/")
  },
)

// 'GET returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// query (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.get(
  "/auth/openid/return",
  (req, res, next) => {
    passport.authenticate("azuread-openidconnect", {
      failureRedirect: "/",
      response: res, // required
    })(req, res, next)
  },
  (req, res) => {
    console.info("We received a GET return from AzureAD.")
    res.redirect("/authenticate/")
  },
)

// 'POST returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// body (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.post(
  "/auth/openid/return",
  (req, res, next) => {
    passport.authenticate("azuread-openidconnect", {
      failureRedirect: "/",
      response: res, // required
    })(req, res, next)
  },
  async (req, res) => {
    console.info("We received a POST return from AzureAD.")

    const user = req.user
    const token = await auth.createCustomToken(user.oid)

    console.log("token")
    console.log(token)

    res.redirect("/authenticate/")
  },
)

// 'logout' route, logout from passport, and destroy the session with AAD.
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    req.logOut()
    res.redirect(destroySessionUrl)
  })
})

export { app }
