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

/***/ "./src/database.ts":
/*!*************************!*\
  !*** ./src/database.ts ***!
  \*************************/
/*! exports provided: database, storage, timestamp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"database\", function() { return database; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"storage\", function() { return storage; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"timestamp\", function() { return timestamp; });\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/**\n * @file Sets up Firebase\n * @author Andreas Schjønhaug\n */\n\n // Only initialise the app once\n\nif (!firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.apps.length) {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.initializeApp(firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().firebase);\n} else {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.app();\n}\n\nconst database = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.database();\nconst storage = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.storage();\nconst timestamp = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.database.ServerValue.TIMESTAMP;\n\n//# sourceURL=webpack:///./src/database.ts?");

/***/ }),

/***/ "./src/enums.ts":
/*!**********************!*\
  !*** ./src/enums.ts ***!
  \**********************/
/*! exports provided: Status */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Status\", function() { return Status; });\nlet Status;\n\n(function (Status) {\n  Status[\"Uploaded\"] = \"uploaded\";\n  Status[\"Transcoding\"] = \"transcoding\";\n  Status[\"Transcribing\"] = \"transcribing\";\n  Status[\"Saving\"] = \"saving\";\n  Status[\"Success\"] = \"success\";\n  Status[\"Failed\"] = \"failed\";\n})(Status || (Status = {}));\n\n//# sourceURL=webpack:///./src/enums.ts?");

/***/ }),

/***/ "./src/helpers.ts":
/*!************************!*\
  !*** ./src/helpers.ts ***!
  \************************/
/*! exports provided: hoursMinutesSecondsToSeconds, updateTranscript */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hoursMinutesSecondsToSeconds\", function() { return hoursMinutesSecondsToSeconds; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateTranscript\", function() { return updateTranscript; });\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\nfunction hoursMinutesSecondsToSeconds(duration) {\n  const [hours, minutes, seconds] = duration.split(\":\"); // minutes are worth 60 seconds. Hours are worth 60 minutes.\n\n  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);\n}\nfunction updateTranscript(_x, _x2) {\n  return _updateTranscript.apply(this, arguments);\n}\n\nfunction _updateTranscript() {\n  _updateTranscript = _asyncToGenerator(function* (id, data) {\n    return _database__WEBPACK_IMPORTED_MODULE_0__[\"database\"].ref(`/transcripts/${id}`).update(_objectSpread({}, data));\n  });\n  return _updateTranscript.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/helpers.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enums */ \"./src/enums.ts\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.ts\");\n/* harmony import */ var _persistence__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./persistence */ \"./src/persistence.ts\");\n/* harmony import */ var _transcoding__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transcoding */ \"./src/transcoding.ts\");\n/* harmony import */ var _transcription__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./transcription */ \"./src/transcription.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Google Cloud function\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n\nexports.transcription = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"database\"].ref(\"/transcripts/{id}\").onCreate(\n/*#__PURE__*/\nfunction () {\n  var _ref = _asyncToGenerator(function* (dataSnapshot, eventContext) {\n    const id = dataSnapshot.key;\n\n    try {\n      const transcript = dataSnapshot.val();\n\n      if (transcript === undefined) {\n        throw Error(\"Transcript missing\");\n      }\n\n      const languageCode = transcript.audioFile.languageCode;\n      console.log(`Deployed 15:37 - Start transcription of id ${id} with ${languageCode} `); // First, check if status is \"uploaded\", otherwise, cancel\n\n      if (transcript.progress.status !== _enums__WEBPACK_IMPORTED_MODULE_1__[\"Status\"].Uploaded) {\n        throw new Error(\"Transcript already processed\");\n      } // 1. Transcode\n\n\n      const gcsUri = yield Object(_transcoding__WEBPACK_IMPORTED_MODULE_4__[\"transcode\"])(id); // 2. Transcribe\n\n      const speechRecognitionResults = yield Object(_transcription__WEBPACK_IMPORTED_MODULE_5__[\"transcribe\"])(id, gcsUri, languageCode); // 3. Save transcription\n\n      yield Object(_persistence__WEBPACK_IMPORTED_MODULE_3__[\"saveResult\"])(speechRecognitionResults, id);\n      console.log(\"End transcribing\", id);\n    } catch (error) {\n      console.error(error);\n      yield Object(_helpers__WEBPACK_IMPORTED_MODULE_2__[\"updateTranscript\"])(id, {\n        error: JSON.parse(JSON.stringify(error)),\n        progress: {\n          percent: null,\n          status: \"failed\"\n        }\n      });\n      throw error;\n    }\n  });\n\n  return function (_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}());\nprocess.on(\"unhandledRejection\", (reason, promise) => {\n  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`));\n});\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/persistence.ts":
/*!****************************!*\
  !*** ./src/persistence.ts ***!
  \****************************/
/*! exports provided: saveResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"saveResult\", function() { return saveResult; });\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Saves transcrips to database\n * @author Andreas Schjønhaug\n */\n\n\nfunction saveResult(_x, _x2) {\n  return _saveResult.apply(this, arguments);\n}\n\nfunction _saveResult() {\n  _saveResult = _asyncToGenerator(function* (speechRecognitionResults, id) {\n    console.log(\"length\", speechRecognitionResults.length);\n    yield Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"updateTranscript\"])(id, {\n      progress: {\n        percent: 0,\n        status: \"saving\"\n      },\n      \"timestamps/transcribedAt\": _database__WEBPACK_IMPORTED_MODULE_0__[\"timestamp\"]\n    }); // Flattening the structure\n\n    for (const index of speechRecognitionResults.keys()) {\n      const words = speechRecognitionResults[index].alternatives[0].words;\n      _database__WEBPACK_IMPORTED_MODULE_0__[\"database\"].ref(`/transcripts/${id}/text`).push(JSON.parse(JSON.stringify(words)));\n      const percent = Math.round((index + 1) / speechRecognitionResults.length * 100);\n\n      if (index + 1 < speechRecognitionResults.length) {\n        yield Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"updateTranscript\"])(id, {\n          \"progress/percent\": percent\n        });\n      } else {\n        yield Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"updateTranscript\"])(id, {\n          progress: {\n            status: \"success\"\n          },\n          \"timestamps/savedAt\": _database__WEBPACK_IMPORTED_MODULE_0__[\"timestamp\"]\n        });\n      }\n    }\n  });\n  return _saveResult.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/persistence.ts?");

/***/ }),

/***/ "./src/transcoding.ts":
/*!****************************!*\
  !*** ./src/transcoding.ts ***!
  \****************************/
/*! exports provided: transcode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcode\", function() { return transcode; });\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ffmpeg-static */ \"ffmpeg-static\");\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fluent-ffmpeg */ \"fluent-ffmpeg\");\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! os */ \"os\");\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Converts uploaded audio to mono channel using FFmpeg\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n\n\n\n/**\n * Utility method to convert audio to mono channel using FFMPEG.\n */\n\nfunction reencode(_x, _x2, _x3) {\n  return _reencode.apply(this, arguments);\n}\n/**\n * When an audio is uploaded in the Storage bucket we generate a mono channel audio automatically using\n * node-fluent-ffmpeg.\n */\n\n\nfunction _reencode() {\n  _reencode = _asyncToGenerator(function* (tempFilePath, targetTempFilePath, id) {\n    return new Promise((resolve, reject) => {\n      fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2___default()(tempFilePath).setFfmpegPath(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default.a.path).audioChannels(1).audioFrequency(16000).format(\"flac\").on(\"error\", err => {\n        reject(err);\n      }).on(\"end\", () => {\n        resolve();\n      }).on(\"codecData\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (data) {\n          // Saving duration to database\n          const durationInSeconds = Object(_helpers__WEBPACK_IMPORTED_MODULE_7__[\"hoursMinutesSecondsToSeconds\"])(data.duration);\n\n          try {\n            yield Object(_helpers__WEBPACK_IMPORTED_MODULE_7__[\"updateTranscript\"])(id, {\n              \"audioFile/durationInSeconds\": durationInSeconds\n            });\n          } catch (error) {\n            console.error(error);\n          }\n        });\n\n        return function (_x5) {\n          return _ref.apply(this, arguments);\n        };\n      }()).save(targetTempFilePath);\n    });\n  });\n  return _reencode.apply(this, arguments);\n}\n\nfunction transcode(_x4) {\n  return _transcode.apply(this, arguments);\n}\n\nfunction _transcode() {\n  _transcode = _asyncToGenerator(function* (id) {\n    // Getting the bucket reference from Google Cloud Runtime Configuration API\n    const uploadsBucketReference = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().bucket.uploads;\n\n    if (uploadsBucketReference === undefined) {\n      throw Error(\"Environment variable 'bucket.upload' not set up\");\n    }\n\n    const uploadsBucket = _database__WEBPACK_IMPORTED_MODULE_6__[\"storage\"].bucket(uploadsBucketReference); // Write status to Firebase\n\n    yield Object(_helpers__WEBPACK_IMPORTED_MODULE_7__[\"updateTranscript\"])(id, {\n      progress: {\n        status: \"transcoding\"\n      }\n    });\n    /*const fileBucket = objectMetaData.bucket // The Storage bucket that contains the file.\n      const contentType = objectMetaData.contentType // File content type.\n    \n      // Exit if this is triggered on a file that is not an audio.\n      if (contentType === undefined || !contentType.startsWith(\"audio/\")) {\n        throw Error(\"Uploaded file is not audio\")\n      }\n    */\n    // Get the file name.\n\n    const fileName = path__WEBPACK_IMPORTED_MODULE_5___default.a.basename(id); // Download file from uploads bucket.\n\n    const tempFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(os__WEBPACK_IMPORTED_MODULE_4___default.a.tmpdir(), fileName); // We add a '.flac' suffix to target audio file name. That's where we'll upload the converted audio.\n\n    const targetTempFileName = fileName.replace(/\\.[^/.]+$/, \"\") + \".flac\";\n    const targetTempFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(os__WEBPACK_IMPORTED_MODULE_4___default.a.tmpdir(), targetTempFileName);\n    const targetStorageFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(path__WEBPACK_IMPORTED_MODULE_5___default.a.dirname(id), targetTempFileName);\n    yield uploadsBucket.file(id).download({\n      destination: tempFilePath\n    });\n    console.log(\"Audio downloaded locally to\", tempFilePath); // Convert the audio to mono channel using FFMPEG.\n\n    yield reencode(tempFilePath, targetTempFilePath, id);\n    console.log(\"Output audio created at\", targetTempFilePath); // Getting the bucket reference from Google Cloud Runtime Configuration API\n\n    const transcodedBucketReference = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().bucket.transcoded;\n\n    if (transcodedBucketReference === undefined) {\n      throw Error(\"Environment variable 'bucket.transcoded' not set up\");\n    }\n\n    const transcodedBucket = _database__WEBPACK_IMPORTED_MODULE_6__[\"storage\"].bucket(transcodedBucketReference); // Uploading the audio to transcoded bucket.\n\n    const [transcodedFile] = yield transcodedBucket.upload(targetTempFilePath, {\n      destination: targetStorageFilePath,\n      resumable: false\n    });\n    console.log(\"Output audio uploaded to\", targetStorageFilePath); // Once the audio has been uploaded delete the local file to free up disk space.\n\n    fs__WEBPACK_IMPORTED_MODULE_3___default.a.unlinkSync(tempFilePath);\n    fs__WEBPACK_IMPORTED_MODULE_3___default.a.unlinkSync(targetTempFilePath);\n    console.log(\"Temporary files removed.\", targetTempFilePath); // Finally, transcribe the transcoded audio file\n\n    console.log(transcodedFile);\n\n    if (transcodedFile.metadata === undefined) {\n      throw new Error(\"Metadata missing on transcoded file\");\n    }\n\n    const bucket = transcodedFile.metadata.bucket;\n    const name = transcodedFile.metadata.name;\n    const gcsUri = `gs://${bucket}/${name}`;\n    return gcsUri;\n  });\n  return _transcode.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcoding.ts?");

/***/ }),

/***/ "./src/transcription.ts":
/*!******************************!*\
  !*** ./src/transcription.ts ***!
  \******************************/
/*! exports provided: transcribe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcribe\", function() { return transcribe; });\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @google-cloud/speech */ \"@google-cloud/speech\");\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Transcripts audio with Google Speech\n * @author Andreas Schjønhaug\n */\n\n\n\nconst client = new _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default.a.v1p1beta1.SpeechClient();\n\nfunction trans(_x, _x2) {\n  return _trans.apply(this, arguments);\n}\n\nfunction _trans() {\n  _trans = _asyncToGenerator(function* (operation, id) {\n    return new Promise((resolve, reject) => {\n      operation.on(\"complete\", (longRunningRecognizeResponse, longRunningRecognizeMetadata, finalApiResponse) => {\n        // Adding a listener for the \"complete\" event starts polling for the\n        // completion of the operation.\n        const speechRecognitionResults = longRunningRecognizeResponse.results;\n        resolve(speechRecognitionResults);\n      }).on(\"progress\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (longRunningRecognizeMetadata, apiResponse) {\n          // Adding a listener for the \"progress\" event causes the callback to be\n          // called on any change in metadata when the operation is polled.\n          const percent = longRunningRecognizeMetadata.progressPercent;\n\n          if (percent !== undefined) {\n            try {\n              yield Object(_helpers__WEBPACK_IMPORTED_MODULE_2__[\"updateTranscript\"])(id, {\n                \"progress/percent\": percent\n              });\n            } catch (error) {\n              console.error(error);\n            }\n          }\n\n          console.log(\"progress\", longRunningRecognizeMetadata, apiResponse);\n        });\n\n        return function (_x6, _x7) {\n          return _ref.apply(this, arguments);\n        };\n      }()).on(\"error\", error => {\n        // Adding a listener for the \"error\" event handles any errors found during polling.\n        reject(error);\n      });\n    });\n  });\n  return _trans.apply(this, arguments);\n}\n\nfunction transcribe(_x3, _x4, _x5) {\n  return _transcribe.apply(this, arguments);\n}\n\nfunction _transcribe() {\n  _transcribe = _asyncToGenerator(function* (id, gcsUri, languageCode) {\n    console.log(\"Start transcribing\", id, languageCode);\n    yield Object(_helpers__WEBPACK_IMPORTED_MODULE_2__[\"updateTranscript\"])(id, {\n      progress: {\n        status: \"transcribing\",\n        percent: 0\n      },\n      \"timestamps/transcodedAt\": _database__WEBPACK_IMPORTED_MODULE_1__[\"timestamp\"]\n    });\n    const request = {\n      audio: {\n        uri: gcsUri\n      },\n      config: {\n        enableAutomaticPunctuation: true,\n        // Only working for en-US at the moment\n        enableWordTimeOffsets: true,\n        languageCode\n      } // Detects speech in the audio file. This creates a recognition job that you\n      // can wait for now, or get its result later.\n\n    };\n    const responses = yield client.longRunningRecognize(request);\n    const operation = responses[0];\n    console.log(\"operation\", operation);\n    const speechRecognitionResults = yield trans(operation, id);\n    return speechRecognitionResults;\n  });\n  return _transcribe.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcription.ts?");

/***/ }),

/***/ "@google-cloud/speech":
/*!***************************************!*\
  !*** external "@google-cloud/speech" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@google-cloud/speech\");\n\n//# sourceURL=webpack:///external_%22@google-cloud/speech%22?");

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

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"os\");\n\n//# sourceURL=webpack:///external_%22os%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ });