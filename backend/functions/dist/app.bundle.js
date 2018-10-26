/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/authenticate/config.ts":
/*!************************************!*\
  !*** ./src/authenticate/config.ts ***!
  \************************************/
/*! exports provided: creds */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"creds\", function() { return creds; });\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_0__);\n\nconst creds = {\n  // Required\n  identityMetadata: firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"config\"]().azure_ad.identity_metadata,\n  // \"https://login.microsoftonline.com/<tenant_name>.onmicrosoft.com/.well-known/openid-configuration\",\n  // or equivalently: 'https://login.microsoftonline.com/<tenant_guid>/.well-known/openid-configuration'\n  //\n  // or you can use the common endpoint\n  // 'https://login.microsoftonline.com/common/.well-known/openid-configuration'\n  // To use the common endpoint, you have to either set `validateIssuer` to false, or provide the `issuer` value.\n  // Required, the client ID of your app in AAD\n  clientID: firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"config\"]().azure_ad.client_id,\n  // Required, must be 'code', 'code id_token', 'id_token code' or 'id_token'\n  responseType: \"code id_token\",\n  // Required\n  responseMode: \"form_post\",\n  // Required, the reply URL registered in AAD for your app\n  redirectUrl: firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"config\"]().azure_ad.redirect_url,\n  // Required if we use http for redirectUrl\n  allowHttpForRedirectUrl: true,\n  // Required if `responseType` is 'code', 'id_token code' or 'code id_token'.\n  // If app key contains '\\', replace it with '\\\\'.\n  clientSecret: firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"config\"]().azure_ad.client_secret,\n  // Required to set to false if you don't want to validate issuer\n  validateIssuer: true,\n  // Required to set to true if you are using B2C endpoint\n  // This sample is for v1 endpoint only, so we set it to false\n  isB2C: false,\n  // Required if you want to provide the issuer(s) you want to validate instead of using the issuer from metadata\n  issuer: null,\n  // Required to set to true if the `verify` function has 'req' as the first parameter\n  passReqToCallback: false,\n  // Recommended to set to true. By default we save state in express session, if this option is set to true, then\n  // we encrypt state and save it in cookie instead. This option together with { session: false } allows your app\n  // to be completely express session free.\n  useCookieInsteadOfSession: true,\n  // Required if `useCookieInsteadOfSession` is set to true. You can provide multiple set of key/iv pairs for key\n  // rollover purpose. We always use the first set of key/iv pair to encrypt cookie, but we will try every set of\n  // key/iv pair to decrypt cookie. Key can be any string of length 32, and iv can be any string of length 12.\n  cookieEncryptionKeys: [{\n    key: \"12345678901234567890123456789012\",\n    iv: \"123456789012\"\n  }, {\n    key: \"abcdefghijklmnopqrstuvwxyzabcdef\",\n    iv: \"abcdefghijkl\"\n  }],\n  // Optional. The additional scope you want besides 'openid', for example: ['email', 'profile'].\n  scope: null,\n  // Optional, 'error', 'warn' or 'info'\n  loggingLevel: \"info\",\n  // Optional. The lifetime of nonce in session or cookie, the default value is 3600 (seconds).\n  nonceLifetime: null,\n  // Optional. The max amount of nonce saved in session or cookie, the default value is 10.\n  nonceMaxAmount: 5,\n  // Optional. The clock skew allowed in token validation, the default value is 300 seconds.\n  clockSkew: null // Optional.\n  // If you want to get access_token for a specific resource, you can provide the resource here; otherwise,\n  // set the value to null.\n  // Note that in order to get access_token, the responseType must be 'code', 'code id_token' or 'id_token code'.\n\n};\nexports.resourceURL = \"https://graph.windows.net\"; // The url you need to go to destroy the session with AAD\n\nexports.destroySessionUrl = \"https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:3000\";\n\n//# sourceURL=webpack:///./src/authenticate/config.ts?");

/***/ }),

/***/ "./src/authenticate/index.ts":
/*!***********************************!*\
  !*** ./src/authenticate/index.ts ***!
  \***********************************/
/*! exports provided: app */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"app\", function() { return app; });\n/**\n * Copyright (c) Microsoft Corporation\n *  All Rights Reserved\n *  MIT License\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy of this\n * software and associated documentation files (the 'Software'), to deal in the Software\n * without restriction, including without limitation the rights to use, copy, modify,\n * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to\n * permit persons to whom the Software is furnished to do so, subject to the following\n * conditions:\n *\n * The above copyright notice and this permission notice shall be\n * included in all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,\n * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS\n * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\n * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT\n * OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n */\n\n/******************************************************************************\n * Module dependencies.\n *****************************************************************************/\n\nconst express = __webpack_require__(/*! express */ \"express\");\n\nconst cookieParser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\n\nconst expressSession = __webpack_require__(/*! express-session */ \"express-session\");\n\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\n\nconst methodOverride = __webpack_require__(/*! method-override */ \"method-override\");\n\nconst passport = __webpack_require__(/*! passport */ \"passport\");\n\nconst util = __webpack_require__(/*! util */ \"util\");\n\nconst config = __webpack_require__(/*! ./config */ \"./src/authenticate/config.ts\"); // Start QuickStart here\n\n\nconst OIDCStrategy = __webpack_require__(/*! passport-azure-ad */ \"passport-azure-ad\").OIDCStrategy;\n/******************************************************************************\n * Set up passport in the app\n ******************************************************************************/\n// -----------------------------------------------------------------------------\n// To support persistent login sessions, Passport needs to be able to\n// serialize users into and deserialize users out of the session.  Typically,\n// this will be as simple as storing the user ID when serializing, and finding\n// the user by ID when deserializing.\n// -----------------------------------------------------------------------------\n\n\npassport.serializeUser(function (user, done) {\n  done(null, user.oid);\n});\npassport.deserializeUser(function (oid, done) {\n  findByOid(oid, function (err, user) {\n    done(err, user);\n  });\n}); // array to hold logged in users\n\nconst users = [];\n\nconst findByOid = function (oid, fn) {\n  for (let i = 0, len = users.length; i < len; i++) {\n    const user = users[i];\n    console.info(\"we are using user: \", user);\n\n    if (user.oid === oid) {\n      return fn(null, user);\n    }\n  }\n\n  return fn(null, null);\n}; // -----------------------------------------------------------------------------\n// Use the OIDCStrategy within Passport.\n//\n// Strategies in passport require a `verify` function, which accepts credentials\n// (in this case, the `oid` claim in id_token), and invoke a callback to find\n// the corresponding user object.\n//\n// The following are the accepted prototypes for the `verify` function\n// (1) function(iss, sub, done)\n// (2) function(iss, sub, profile, done)\n// (3) function(iss, sub, profile, access_token, refresh_token, done)\n// (4) function(iss, sub, profile, access_token, refresh_token, params, done)\n// (5) function(iss, sub, profile, jwtClaims, access_token, refresh_token, params, done)\n// (6) prototype (1)-(5) with an additional `req` parameter as the first parameter\n//\n// To do prototype (6), passReqToCallback must be set to true in the config.\n// -----------------------------------------------------------------------------\n\n\npassport.use(new OIDCStrategy({\n  identityMetadata: config.creds.identityMetadata,\n  clientID: config.creds.clientID,\n  responseType: config.creds.responseType,\n  responseMode: config.creds.responseMode,\n  redirectUrl: config.creds.redirectUrl,\n  allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,\n  clientSecret: config.creds.clientSecret,\n  validateIssuer: config.creds.validateIssuer,\n  isB2C: config.creds.isB2C,\n  issuer: config.creds.issuer,\n  passReqToCallback: config.creds.passReqToCallback,\n  scope: config.creds.scope,\n  loggingLevel: config.creds.loggingLevel,\n  nonceLifetime: config.creds.nonceLifetime,\n  nonceMaxAmount: config.creds.nonceMaxAmount,\n  useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,\n  cookieEncryptionKeys: config.creds.cookieEncryptionKeys,\n  clockSkew: config.creds.clockSkew\n}, function (iss, sub, profile, accessToken, refreshToken, done) {\n  if (!profile.oid) {\n    return done(new Error(\"No oid found\"), null);\n  } // asynchronous verification, for effect...\n\n\n  process.nextTick(function () {\n    findByOid(profile.oid, function (err, user) {\n      if (err) {\n        return done(err);\n      }\n\n      if (!user) {\n        // \"Auto-registration\"\n        users.push(profile);\n        return done(null, profile);\n      }\n\n      return done(null, user);\n    });\n  });\n})); // -----------------------------------------------------------------------------\n// Config the app, include middlewares\n// -----------------------------------------------------------------------------\n\nconst app = express();\napp.set(\"views\", __dirname + \"/views\");\napp.set(\"view engine\", \"ejs\"); // app.use(express.logger())\n\napp.use(methodOverride());\napp.use(cookieParser());\napp.use(expressSession({\n  secret: \"keyboard cat\",\n  resave: true,\n  saveUninitialized: false\n}));\napp.use(bodyParser.urlencoded({\n  extended: true\n})); // Initialize Passport!  Also use passport.session() middleware, to support\n// persistent login sessions (recommended).\n\napp.use(passport.initialize());\napp.use(passport.session()); // app.use(app.router)\n\napp.use(express.static(__dirname + \"/../../public\")); // -----------------------------------------------------------------------------\n// Set up the route controller\n//\n// 1. For 'login' route and 'returnURL' route, use `passport.authenticate`.\n// This way the passport middleware can redirect the user to login page, receive\n// id_token etc from returnURL.\n//\n// 2. For the routes you want to check if user is already logged in, use\n// `ensureAuthenticated`. It checks if there is an user stored in session, if not\n// it will call `passport.authenticate` to ask for user to log in.\n// -----------------------------------------------------------------------------\n\nfunction ensureAuthenticated(req, res, next) {\n  if (req.isAuthenticated()) {\n    return next();\n  }\n\n  res.redirect(\"/login\");\n}\n\napp.get(\"/\", (req, res) => {\n  console.log(req);\n  console.log(req.user);\n  res.send(\"Hello World!!! ee\");\n}); // '/account' is only available to logged in user\n\napp.get(\"/account\", ensureAuthenticated, function (req, res) {\n  res.render(\"account\", {\n    user: req.user\n  });\n});\napp.get(\"/login\", function (req, res, next) {\n  passport.authenticate(\"azuread-openidconnect\", {\n    response: res,\n    // required\n    resourceURL: config.resourceURL,\n    // optional. Provide a value if you want to specify the resource.\n    customState: \"my_state\",\n    // optional. Provide a value if you want to provide custom state value.\n    failureRedirect: \"/\"\n  })(req, res, next);\n}, function (req, res) {\n  console.info(\"Login was called in the Sample\");\n  res.redirect(\"/authenticate/\");\n}); // 'GET returnURL'\n// `passport.authenticate` will try to authenticate the content returned in\n// query (such as authorization code). If authentication fails, user will be\n// redirected to '/' (home page); otherwise, it passes to the next middleware.\n\napp.get(\"/auth/openid/return\", function (req, res, next) {\n  passport.authenticate(\"azuread-openidconnect\", {\n    response: res,\n    // required\n    failureRedirect: \"/\"\n  })(req, res, next);\n}, function (req, res) {\n  console.info(\"We received a return from AzureAD.\");\n  res.redirect(\"/authenticate/\");\n}); // 'POST returnURL'\n// `passport.authenticate` will try to authenticate the content returned in\n// body (such as authorization code). If authentication fails, user will be\n// redirected to '/' (home page); otherwise, it passes to the next middleware.\n\napp.post(\"/auth/openid/return\", function (req, res, next) {\n  passport.authenticate(\"azuread-openidconnect\", {\n    response: res,\n    // required\n    failureRedirect: \"/\"\n  })(req, res, next);\n}, function (req, res) {\n  console.info(\"We received a return from AzureAD.\");\n  res.redirect(\"/authenticate/\");\n}); // 'logout' route, logout from passport, and destroy the session with AAD.\n\napp.get(\"/logout\", function (req, res) {\n  req.session.destroy(function (err) {\n    req.logOut();\n    res.redirect(config.destroySessionUrl);\n  });\n});\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./src/authenticate/index.ts?");

/***/ }),

/***/ "./src/database.ts":
/*!*************************!*\
  !*** ./src/database.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! serialize-error */ \"serialize-error\");\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(serialize_error__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enums */ \"./src/enums.ts\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Sets up Firebase\n * @author Andreas Schjønhaug\n */\n\n\n\n // Only initialise the app once\n\nif (!firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.apps.length) {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.initializeApp(firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().firebase);\n} else {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.app();\n}\n\nconst realtimeDatabase = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.database();\n\nconst database = (() => {\n  const updateTranscript =\n  /*#__PURE__*/\n  function () {\n    var _ref = _asyncToGenerator(function* (id, transcription) {\n      return realtimeDatabase.ref(`/transcripts/${id}`).update(_objectSpread({}, transcription));\n    });\n\n    return function updateTranscript(_x, _x2) {\n      return _ref.apply(this, arguments);\n    };\n  }();\n\n  const setStatus =\n  /*#__PURE__*/\n  function () {\n    var _ref2 = _asyncToGenerator(function* (id, status) {\n      const transcription = {\n        \"progress/status\": status,\n        [`timestamps/${status}`]: firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.database.ServerValue.TIMESTAMP // We get completion percentages when transcribing and saving, so setting them to zero.\n\n      };\n\n      if (status === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Transcribing || status === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Saving) {\n        transcription[\"progress/percent\"] = 0;\n      } else {\n        transcription[\"progress/percent\"] = null;\n      }\n\n      return updateTranscript(id, transcription);\n    });\n\n    return function setStatus(_x3, _x4) {\n      return _ref2.apply(this, arguments);\n    };\n  }();\n\n  const setPercent =\n  /*#__PURE__*/\n  function () {\n    var _ref3 = _asyncToGenerator(function* (id, percent) {\n      const transcription = {\n        \"progress/percent\": percent\n      };\n      return updateTranscript(id, transcription);\n    });\n\n    return function setPercent(_x5, _x6) {\n      return _ref3.apply(this, arguments);\n    };\n  }();\n\n  const addWords =\n  /*#__PURE__*/\n  function () {\n    var _ref4 = _asyncToGenerator(function* (id, words) {\n      return realtimeDatabase.ref(`/transcripts/${id}/text`).push(JSON.parse(JSON.stringify(words)));\n    });\n\n    return function addWords(_x7, _x8) {\n      return _ref4.apply(this, arguments);\n    };\n  }();\n\n  const setDurationInSeconds =\n  /*#__PURE__*/\n  function () {\n    var _ref5 = _asyncToGenerator(function* (id, seconds) {\n      const transcription = {\n        \"audioFile/durationInSeconds\": seconds\n      };\n      return updateTranscript(id, transcription);\n    });\n\n    return function setDurationInSeconds(_x9, _x10) {\n      return _ref5.apply(this, arguments);\n    };\n  }();\n\n  const errorOccured =\n  /*#__PURE__*/\n  function () {\n    var _ref6 = _asyncToGenerator(function* (id, error) {\n      const data = {\n        error: serialize_error__WEBPACK_IMPORTED_MODULE_2___default()(error),\n        progress: {\n          percent: null,\n          status: \"failed\"\n        }\n      };\n      return updateTranscript(id, data);\n    });\n\n    return function errorOccured(_x11, _x12) {\n      return _ref6.apply(this, arguments);\n    };\n  }();\n\n  const getStatus =\n  /*#__PURE__*/\n  function () {\n    var _ref7 = _asyncToGenerator(function* (id) {\n      const eventId = yield realtimeDatabase.ref(`/transcripts/${id}/progress/status`).once(\"value\");\n      return eventId.val();\n    });\n\n    return function getStatus(_x13) {\n      return _ref7.apply(this, arguments);\n    };\n  }();\n\n  return {\n    addWords,\n    errorOccured,\n    setDurationInSeconds,\n    setStatus,\n    setPercent,\n    getStatus\n  };\n})();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (database);\n\n//# sourceURL=webpack:///./src/database.ts?");

/***/ }),

/***/ "./src/enums.ts":
/*!**********************!*\
  !*** ./src/enums.ts ***!
  \**********************/
/*! exports provided: Status */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Status\", function() { return Status; });\nlet Status;\n\n(function (Status) {\n  Status[\"Analysing\"] = \"analysing\";\n  Status[\"Transcoding\"] = \"transcoding\";\n  Status[\"Transcribing\"] = \"transcribing\";\n  Status[\"Saving\"] = \"saving\";\n  Status[\"Success\"] = \"success\";\n  Status[\"Failed\"] = \"failed\";\n})(Status || (Status = {}));\n\n//# sourceURL=webpack:///./src/enums.ts?");

/***/ }),

/***/ "./src/helpers.ts":
/*!************************!*\
  !*** ./src/helpers.ts ***!
  \************************/
/*! exports provided: hoursMinutesSecondsToSeconds */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hoursMinutesSecondsToSeconds\", function() { return hoursMinutesSecondsToSeconds; });\nfunction hoursMinutesSecondsToSeconds(duration) {\n  const [hours, minutes, seconds] = duration.split(\":\"); // minutes are worth 60 seconds. Hours are worth 60 minutes.\n\n  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);\n}\n\n//# sourceURL=webpack:///./src/helpers.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _authenticate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./authenticate */ \"./src/authenticate/index.ts\");\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\n/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enums */ \"./src/enums.ts\");\n/* harmony import */ var _persistence__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./persistence */ \"./src/persistence.ts\");\n/* harmony import */ var _transcoding__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./transcoding */ \"./src/transcoding.ts\");\n/* harmony import */ var _transcription__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transcription */ \"./src/transcription.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Google Cloud function\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n\n\nexports.transcription = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"region\"](\"europe-west1\").database.ref(\"/transcripts/{id}\").onCreate(\n/*#__PURE__*/\nfunction () {\n  var _ref = _asyncToGenerator(function* (dataSnapshot, eventContext) {\n    const id = dataSnapshot.key;\n    console.log(`Deployed 09:08 - Start transcription of id: ${id}`);\n\n    try {\n      // Because of indempotency, we need to fetch the transcript from the server and check if it's already in process\n      const status = yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getStatus(id);\n\n      if (status !== _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Analysing) {\n        console.warn(\"Transcript already processed, returning\");\n        return;\n      }\n\n      const transcript = dataSnapshot.val();\n\n      if (transcript === undefined) {\n        throw Error(\"Transcript missing\");\n      }\n\n      const languageCode = transcript.audioFile.languageCode; // 1. Transcode\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStatus(id, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Transcoding);\n      const gcsUri = yield Object(_transcoding__WEBPACK_IMPORTED_MODULE_5__[\"transcode\"])(id); // 2. Transcribe\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStatus(id, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Transcribing);\n      const speechRecognitionResults = yield Object(_transcription__WEBPACK_IMPORTED_MODULE_6__[\"transcribe\"])(id, gcsUri, languageCode); // 3. Save transcription\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStatus(id, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Saving);\n      yield Object(_persistence__WEBPACK_IMPORTED_MODULE_4__[\"saveResult\"])(speechRecognitionResults, id); // 4. Done\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStatus(id, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Success);\n      console.log(\"End transcribing with id: \", id);\n    } catch (error) {\n      console.log(\"Error in main function\");\n      console.error(error);\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].errorOccured(id, error);\n      throw error;\n    }\n  });\n\n  return function (_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}());\nexports.authenticate = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"region\"](\"europe-west1\").https.onRequest(_authenticate__WEBPACK_IMPORTED_MODULE_1__[\"app\"]);\nprocess.on(\"unhandledRejection\", (reason, promise) => {\n  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`));\n});\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/persistence.ts":
/*!****************************!*\
  !*** ./src/persistence.ts ***!
  \****************************/
/*! exports provided: saveResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"saveResult\", function() { return saveResult; });\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Saves transcrips to database\n * @author Andreas Schjønhaug\n */\n\nfunction saveResult(_x, _x2) {\n  return _saveResult.apply(this, arguments);\n}\n\nfunction _saveResult() {\n  _saveResult = _asyncToGenerator(function* (speechRecognitionResults, id) {\n    console.log(\"length\", speechRecognitionResults.length); // Flattening the structure\n\n    for (const index of speechRecognitionResults.keys()) {\n      const words = speechRecognitionResults[index].alternatives[0].words;\n      yield _database__WEBPACK_IMPORTED_MODULE_0__[\"default\"].addWords(id, words);\n      const percent = Math.round((index + 1) / speechRecognitionResults.length * 100);\n\n      if (index + 1 < speechRecognitionResults.length) {\n        yield _database__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setPercent(id, percent);\n      }\n    }\n  });\n  return _saveResult.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/persistence.ts?");

/***/ }),

/***/ "./src/storage.ts":
/*!************************!*\
  !*** ./src/storage.ts ***!
  \************************/
/*! exports provided: storage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"storage\", function() { return storage; });\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/**\n * @file Sets up Storage\n * @author Andreas Schjønhaug\n */\n\n // Only initialise the app once\n\nif (!firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.apps.length) {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.initializeApp(firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().firebase);\n} else {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.app();\n}\n\nconst storage = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.storage();\n\n//# sourceURL=webpack:///./src/storage.ts?");

/***/ }),

/***/ "./src/transcoding.ts":
/*!****************************!*\
  !*** ./src/transcoding.ts ***!
  \****************************/
/*! exports provided: transcode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcode\", function() { return transcode; });\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ffmpeg-static */ \"ffmpeg-static\");\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fluent-ffmpeg */ \"fluent-ffmpeg\");\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! os */ \"os\");\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.ts\");\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./storage */ \"./src/storage.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Converts uploaded audio to mono channel using FFmpeg\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n\n\n\n\n/**\n * Utility method to convert audio to mono channel using FFMPEG.\n */\n\nfunction reencodeToMono(_x, _x2, _x3) {\n  return _reencodeToMono.apply(this, arguments);\n}\n/**\n * When an audio is uploaded in the Storage bucket we generate a mono channel audio automatically using\n * node-fluent-ffmpeg.\n */\n\n\nfunction _reencodeToMono() {\n  _reencodeToMono = _asyncToGenerator(function* (tempFilePath, targetTempFilePath, id) {\n    return new Promise((resolve, reject) => {\n      fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2___default()(tempFilePath).setFfmpegPath(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default.a.path).audioChannels(1).audioFrequency(16000).format(\"flac\").on(\"error\", err => {\n        reject(err);\n      }).on(\"end\", () => {\n        resolve();\n      }).on(\"codecData\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (data) {\n          // Saving duration to database\n          const durationInSeconds = Object(_helpers__WEBPACK_IMPORTED_MODULE_7__[\"hoursMinutesSecondsToSeconds\"])(data.duration);\n\n          try {\n            yield _database__WEBPACK_IMPORTED_MODULE_6__[\"default\"].setDurationInSeconds(id, durationInSeconds);\n          } catch (error) {\n            console.log(\"Error in transcoding on('codecData')\");\n            console.error(error);\n          }\n        });\n\n        return function (_x5) {\n          return _ref.apply(this, arguments);\n        };\n      }()).save(targetTempFilePath);\n    });\n  });\n  return _reencodeToMono.apply(this, arguments);\n}\n\nfunction transcode(_x4) {\n  return _transcode.apply(this, arguments);\n}\n\nfunction _transcode() {\n  _transcode = _asyncToGenerator(function* (id) {\n    // Getting the bucket reference from Google Cloud Runtime Configuration API\n    const uploadsBucketReference = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().bucket.uploads;\n\n    if (uploadsBucketReference === undefined) {\n      throw Error(\"Environment variable 'bucket.upload' not set up\");\n    }\n\n    const uploadsBucket = _storage__WEBPACK_IMPORTED_MODULE_8__[\"storage\"].bucket(uploadsBucketReference);\n    /*const fileBucket = objectMetaData.bucket // The Storage bucket that contains the file.\n      const contentType = objectMetaData.contentType // File content type.\n    \n      // Exit if this is triggered on a file that is not an audio.\n      if (contentType === undefined || !contentType.startsWith(\"audio/\")) {\n        throw Error(\"Uploaded file is not audio\")\n      }\n    */\n    // Get the file name.\n\n    const fileName = path__WEBPACK_IMPORTED_MODULE_5___default.a.basename(id); // Download file from uploads bucket.\n\n    const tempFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(os__WEBPACK_IMPORTED_MODULE_4___default.a.tmpdir(), fileName); // We add a '.flac' suffix to target audio file name. That's where we'll upload the converted audio.\n\n    const targetTempFileName = fileName.replace(/\\.[^/.]+$/, \"\") + \".flac\";\n    const targetTempFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(os__WEBPACK_IMPORTED_MODULE_4___default.a.tmpdir(), targetTempFileName);\n    const targetStorageFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(path__WEBPACK_IMPORTED_MODULE_5___default.a.dirname(id), targetTempFileName);\n    yield uploadsBucket.file(id).download({\n      destination: tempFilePath\n    });\n    console.log(\"Audio downloaded locally to\", tempFilePath); // Convert the audio to mono channel using FFMPEG.\n\n    yield reencodeToMono(tempFilePath, targetTempFilePath, id);\n    console.log(\"Output audio created at\", targetTempFilePath); // Getting the bucket reference from Google Cloud Runtime Configuration API\n\n    const transcodedBucketReference = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().bucket.transcoded;\n\n    if (transcodedBucketReference === undefined) {\n      throw Error(\"Environment variable 'bucket.transcoded' not set up\");\n    }\n\n    const transcodedBucket = _storage__WEBPACK_IMPORTED_MODULE_8__[\"storage\"].bucket(transcodedBucketReference); // Uploading the audio to transcoded bucket.\n\n    const [transcodedFile] = yield transcodedBucket.upload(targetTempFilePath, {\n      destination: targetStorageFilePath,\n      resumable: false\n    });\n    console.log(\"Output audio uploaded to\", targetStorageFilePath); // Once the audio has been uploaded delete the local file to free up disk space.\n\n    fs__WEBPACK_IMPORTED_MODULE_3___default.a.unlinkSync(tempFilePath);\n    fs__WEBPACK_IMPORTED_MODULE_3___default.a.unlinkSync(targetTempFilePath);\n    console.log(\"Temporary files removed.\", targetTempFilePath); // Finally, transcribe the transcoded audio file\n\n    console.log(transcodedFile);\n\n    if (transcodedFile.metadata === undefined) {\n      throw new Error(\"Metadata missing on transcoded file\");\n    }\n\n    const bucket = transcodedFile.metadata.bucket;\n    const name = transcodedFile.metadata.name;\n\n    if (bucket === undefined || name === undefined) {\n      throw new Error(\"Error in metadata on transcoded file\");\n    }\n\n    return `gs://${bucket}/${name}`;\n  });\n  return _transcode.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcoding.ts?");

/***/ }),

/***/ "./src/transcription.ts":
/*!******************************!*\
  !*** ./src/transcription.ts ***!
  \******************************/
/*! exports provided: transcribe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcribe\", function() { return transcribe; });\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @google-cloud/speech */ \"@google-cloud/speech\");\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Transcripts audio with Google Speech\n * @author Andreas Schjønhaug\n */\n\n\nconst client = new _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default.a.v1p1beta1.SpeechClient();\n\nfunction trans(_x, _x2) {\n  return _trans.apply(this, arguments);\n}\n\nfunction _trans() {\n  _trans = _asyncToGenerator(function* (operation, id) {\n    return new Promise((resolve, reject) => {\n      operation.on(\"complete\", (longRunningRecognizeResponse\n      /*, longRunningRecognizeMetadata, finalApiResponse*/\n      ) => {\n        // Adding a listener for the \"complete\" event starts polling for the\n        // completion of the operation.\n        const speechRecognitionResults = longRunningRecognizeResponse.results;\n        resolve(speechRecognitionResults);\n      }).on(\"progress\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (longRunningRecognizeMetadata\n        /*, apiResponse*/\n        ) {\n          // Adding a listener for the \"progress\" event causes the callback to be\n          // called on any change in metadata when the operation is polled.\n          const percent = longRunningRecognizeMetadata.progressPercent;\n\n          if (percent !== undefined) {\n            try {\n              yield _database__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setPercent(id, percent);\n            } catch (error) {\n              console.log(\"Error in on.('progress')\");\n              console.error(error);\n            }\n          }\n\n          console.log(\"progress\", longRunningRecognizeMetadata\n          /*, apiResponse*/\n          );\n        });\n\n        return function (_x6) {\n          return _ref.apply(this, arguments);\n        };\n      }()).on(\"error\", error => {\n        // Adding a listener for the \"error\" event handles any errors found during polling.\n        reject(error);\n      });\n    });\n  });\n  return _trans.apply(this, arguments);\n}\n\nfunction transcribe(_x3, _x4, _x5) {\n  return _transcribe.apply(this, arguments);\n}\n\nfunction _transcribe() {\n  _transcribe = _asyncToGenerator(function* (id, gcsUri, languageCode) {\n    console.log(\"Start transcribing\", id, languageCode);\n    const request = {\n      audio: {\n        uri: gcsUri\n      },\n      config: {\n        enableAutomaticPunctuation: true,\n        // Only working for en-US at the moment\n        enableWordTimeOffsets: true,\n        languageCode\n      } // Detects speech in the audio file. This creates a recognition job that you\n      // can wait for now, or get its result later.\n\n    };\n    const responses = yield client.longRunningRecognize(request);\n    const operation = responses[0];\n    console.log(\"operation\", operation);\n    const speechRecognitionResults = yield trans(operation, id);\n    return speechRecognitionResults;\n  });\n  return _transcribe.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcription.ts?");

/***/ }),

/***/ "@google-cloud/speech":
/*!***************************************!*\
  !*** external "@google-cloud/speech" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@google-cloud/speech\");\n\n//# sourceURL=webpack:///external_%22@google-cloud/speech%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cookie-parser\");\n\n//# sourceURL=webpack:///external_%22cookie-parser%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-session\");\n\n//# sourceURL=webpack:///external_%22express-session%22?");

/***/ }),

/***/ "ffmpeg-static":
/*!********************************!*\
  !*** external "ffmpeg-static" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"ffmpeg-static\");\n\n//# sourceURL=webpack:///external_%22ffmpeg-static%22?");

/***/ }),

/***/ "firebase-admin":
/*!*********************************!*\
  !*** external "firebase-admin" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase-admin\");\n\n//# sourceURL=webpack:///external_%22firebase-admin%22?");

/***/ }),

/***/ "firebase-functions":
/*!*************************************!*\
  !*** external "firebase-functions" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase-functions\");\n\n//# sourceURL=webpack:///external_%22firebase-functions%22?");

/***/ }),

/***/ "fluent-ffmpeg":
/*!********************************!*\
  !*** external "fluent-ffmpeg" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fluent-ffmpeg\");\n\n//# sourceURL=webpack:///external_%22fluent-ffmpeg%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "method-override":
/*!**********************************!*\
  !*** external "method-override" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"method-override\");\n\n//# sourceURL=webpack:///external_%22method-override%22?");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"os\");\n\n//# sourceURL=webpack:///external_%22os%22?");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport\");\n\n//# sourceURL=webpack:///external_%22passport%22?");

/***/ }),

/***/ "passport-azure-ad":
/*!************************************!*\
  !*** external "passport-azure-ad" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-azure-ad\");\n\n//# sourceURL=webpack:///external_%22passport-azure-ad%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "serialize-error":
/*!**********************************!*\
  !*** external "serialize-error" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"serialize-error\");\n\n//# sourceURL=webpack:///external_%22serialize-error%22?");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");\n\n//# sourceURL=webpack:///external_%22util%22?");

/***/ })

/******/ });