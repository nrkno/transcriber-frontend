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
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! serialize-error */ \"serialize-error\");\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(serialize_error__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enums */ \"./src/enums.ts\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Sets up Firebase\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n// Only initialise the app once\nif (!firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.apps.length) {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.initializeApp(firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().firebase);\n} else {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.app();\n}\n\nconst db = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.firestore();\nconst settings = {\n  timestampsInSnapshots: true\n};\ndb.settings(settings);\n\nconst database = (() => {\n  const updateTranscript =\n  /*#__PURE__*/\n  function () {\n    var _ref = _asyncToGenerator(function* (id, transcript) {\n      return db.doc(`transcripts/${id}`).set(_objectSpread({}, transcript), {\n        merge: true\n      });\n    });\n\n    return function updateTranscript(_x, _x2) {\n      return _ref.apply(this, arguments);\n    };\n  }();\n\n  const setStep =\n  /*#__PURE__*/\n  function () {\n    var _ref2 = _asyncToGenerator(function* (transcriptId, step) {\n      const transcript = {\n        process: {\n          step\n        }\n      };\n\n      if (step === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Transcoding || step === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Saving) {\n        transcript.process.percent = 0;\n      } else if (step === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Done) {\n        transcript.process.percent = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.firestore.FieldValue.delete();\n      }\n\n      return updateTranscript(transcriptId, transcript);\n    });\n\n    return function setStep(_x3, _x4) {\n      return _ref2.apply(this, arguments);\n    };\n  }();\n\n  const setPercent =\n  /*#__PURE__*/\n  function () {\n    var _ref3 = _asyncToGenerator(function* (transcriptId, percent) {\n      const transcript = {\n        process: {\n          percent\n        }\n      };\n      return updateTranscript(transcriptId, transcript);\n    });\n\n    return function setPercent(_x5, _x6) {\n      return _ref3.apply(this, arguments);\n    };\n  }();\n\n  const addResult =\n  /*#__PURE__*/\n  function () {\n    var _ref4 = _asyncToGenerator(function* (transcriptId, result) {\n      return db.collection(`transcripts/${transcriptId}/results`).add(result);\n    });\n\n    return function addResult(_x7, _x8) {\n      return _ref4.apply(this, arguments);\n    };\n  }();\n\n  const setDuration =\n  /*#__PURE__*/\n  function () {\n    var _ref5 = _asyncToGenerator(function* (id, seconds) {\n      const transcript = {\n        metadata: {\n          audioDuration: seconds\n        }\n      };\n      return updateTranscript(id, transcript);\n    });\n\n    return function setDuration(_x9, _x10) {\n      return _ref5.apply(this, arguments);\n    };\n  }();\n\n  const errorOccured =\n  /*#__PURE__*/\n  function () {\n    var _ref6 = _asyncToGenerator(function* (transcriptId, error) {\n      const transcript = {\n        process: {\n          error: serialize_error__WEBPACK_IMPORTED_MODULE_2___default()(error)\n        }\n      };\n      return updateTranscript(transcriptId, transcript);\n    });\n\n    return function errorOccured(_x11, _x12) {\n      return _ref6.apply(this, arguments);\n    };\n  }();\n\n  const getResults =\n  /*#__PURE__*/\n  function () {\n    var _ref7 = _asyncToGenerator(function* (transcriptId) {\n      const querySnapshot = yield db.collection(`transcripts/${transcriptId}/results`).orderBy(\"startTime\").get();\n      const results = Array();\n      querySnapshot.forEach(doc => {\n        const result = doc.data();\n        results.push(result);\n      });\n      return results;\n    });\n\n    return function getResults(_x13) {\n      return _ref7.apply(this, arguments);\n    };\n  }();\n\n  const getStep =\n  /*#__PURE__*/\n  function () {\n    var _ref8 = _asyncToGenerator(function* (id) {\n      const doc = yield db.doc(`transcripts/${id}`).get();\n      const transcript = doc.data();\n      return transcript.process.step;\n    });\n\n    return function getStep(_x14) {\n      return _ref8.apply(this, arguments);\n    };\n  }();\n\n  const setPlaybackUrl =\n  /*#__PURE__*/\n  function () {\n    var _ref9 = _asyncToGenerator(function* (id, url) {\n      const transcript = {\n        playbackUrl: url\n      };\n      return updateTranscript(id, transcript);\n    });\n\n    return function setPlaybackUrl(_x15, _x16) {\n      return _ref9.apply(this, arguments);\n    };\n  }();\n\n  const getTranscript =\n  /*#__PURE__*/\n  function () {\n    var _ref10 = _asyncToGenerator(function* (transcriptId) {\n      const doc = yield db.doc(`transcripts/${transcriptId}`).get();\n      return doc.data();\n    });\n\n    return function getTranscript(_x17) {\n      return _ref10.apply(this, arguments);\n    };\n  }();\n\n  const addTranscriptSummary =\n  /*#__PURE__*/\n  function () {\n    var _ref11 = _asyncToGenerator(function* (transcriptSummary) {\n      const transcriptsRef = db.doc(\"statistics/transcripts\");\n      const doc = yield transcriptsRef.get();\n      const transcripts = doc.data() || {\n        duration: 0,\n        transcripts: 0,\n        words: 0 // Adding duration and words from transcriptSummary\n\n      };\n      transcripts.duration += transcriptSummary.duration;\n      transcripts.transcripts += 1;\n      transcripts.words += transcriptSummary.words; // Get a new write batch\n\n      const batch = db.batch(); // Set the values of duration and words\n\n      batch.set(transcriptsRef, transcripts); // Add to transcript summary\n\n      const autoGeneratedId = db.collection(\"statistics\").doc().id;\n      const summariesRef = transcriptsRef.collection(\"summaries\").doc(autoGeneratedId);\n      batch.set(summariesRef, transcriptSummary); // Commit the batch\n\n      return batch.commit();\n    });\n\n    return function addTranscriptSummary(_x18) {\n      return _ref11.apply(this, arguments);\n    };\n  }();\n\n  return {\n    addResult,\n    errorOccured,\n    setDuration,\n    setStep,\n    setPercent,\n    getStep,\n    getResults,\n    setPlaybackUrl,\n    getTranscript,\n    addTranscriptSummary\n  };\n})();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (database);\n\n//# sourceURL=webpack:///./src/database.ts?");

/***/ }),

/***/ "./src/enums.ts":
/*!**********************!*\
  !*** ./src/enums.ts ***!
  \**********************/
/*! exports provided: Step, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, AudioEncoding */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Step\", function() { return Step; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"InteractionType\", function() { return InteractionType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MicrophoneDistance\", function() { return MicrophoneDistance; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"OriginalMediaType\", function() { return OriginalMediaType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RecordingDeviceType\", function() { return RecordingDeviceType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AudioEncoding\", function() { return AudioEncoding; });\nlet Step; // Use case categories that the audio recognition request can be described by.\n\n(function (Step) {\n  Step[\"Uploading\"] = \"UPLOADING\";\n  Step[\"Transcoding\"] = \"TRANSCODING\";\n  Step[\"Transcribing\"] = \"TRANSCRIBING\";\n  Step[\"Saving\"] = \"SAVING\";\n  Step[\"Done\"] = \"DONE\";\n})(Step || (Step = {}));\n\nlet InteractionType;\n\n(function (InteractionType) {\n  InteractionType[\"Unspecified\"] = \"INTERACTION_TYPE_UNSPECIFIED\";\n  InteractionType[\"Discussion\"] = \"DISCUSSION\";\n  InteractionType[\"Presentaton\"] = \"PRESENTATION\";\n  InteractionType[\"PhoneCall\"] = \"PHONE_CALL\";\n  InteractionType[\"Voicemail\"] = \"VOICEMAIL\";\n  InteractionType[\"ProfessionallyProduced\"] = \"PROFESSIONALLY_PRODUCED\";\n  InteractionType[\"VoiceSearch\"] = \"VOICE_SEARCH\";\n  InteractionType[\"VoiceCommand\"] = \"VOICE_COMMAND\";\n  InteractionType[\"Dictation\"] = \"DICTATION\";\n})(InteractionType || (InteractionType = {}));\n\n// Enumerates the types of capture settings describing an audio file.\nlet MicrophoneDistance;\n\n(function (MicrophoneDistance) {\n  MicrophoneDistance[\"Unspecified\"] = \"MICROPHONE_DISTANCE_UNSPECIFIED\";\n  MicrophoneDistance[\"Nearfield\"] = \"NEARFIELD\";\n  MicrophoneDistance[\"Midfield\"] = \"MIDFIELD\";\n  MicrophoneDistance[\"Farfield\"] = \"FARFIELD\";\n})(MicrophoneDistance || (MicrophoneDistance = {}));\n\n// The original media the speech was recorded on.\nlet OriginalMediaType;\n\n(function (OriginalMediaType) {\n  OriginalMediaType[\"Unspecified\"] = \"ORIGINAL_MEDIA_TYPE_UNSPECIFIED\";\n  OriginalMediaType[\"Audio\"] = \"AUDIO\";\n  OriginalMediaType[\"Video\"] = \"VIDEO\";\n})(OriginalMediaType || (OriginalMediaType = {}));\n\n// The type of device the speech was recorded with.\nlet RecordingDeviceType;\n\n(function (RecordingDeviceType) {\n  RecordingDeviceType[\"Unspecified\"] = \"RECORDING_DEVICE_TYPE_UNSPECIFIED\";\n  RecordingDeviceType[\"Smartphone\"] = \"SMARTPHONE\";\n  RecordingDeviceType[\"PC\"] = \"PC\";\n  RecordingDeviceType[\"PhoneLine\"] = \"PHONE_LINE\";\n  RecordingDeviceType[\"Vehicle\"] = \"VEHICLE\";\n  RecordingDeviceType[\"OtherOutdoorDevice\"] = \"OTHER_OUTDOOR_DEVICE\";\n  RecordingDeviceType[\"OtherIndoorDevice\"] = \"OTHER_INDOOR_DEVICE\";\n})(RecordingDeviceType || (RecordingDeviceType = {}));\n\n// The encoding of the audio data sent in the request.\nlet AudioEncoding;\n\n(function (AudioEncoding) {\n  AudioEncoding[\"Unspecified\"] = \"ENCODING_UNSPECIFIED\";\n  AudioEncoding[\"Linear16\"] = \"LINEAR16\";\n  AudioEncoding[\"Flac\"] = \"FLAC\";\n  AudioEncoding[\"Mulaw\"] = \"MULAW\";\n  AudioEncoding[\"Amr\"] = \"AMR\";\n  AudioEncoding[\"AmrWb\"] = \"AMR_WB\";\n  AudioEncoding[\"OggOpus\"] = \"OGG_OPUS\";\n  AudioEncoding[\"SpeedxWithHeaderByte\"] = \"SPEEX_WITH_HEADER_BYTE\";\n})(AudioEncoding || (AudioEncoding = {}));\n\n//# sourceURL=webpack:///./src/enums.ts?");

/***/ }),

/***/ "./src/exportToDoc/index.ts":
/*!**********************************!*\
  !*** ./src/exportToDoc/index.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var docx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! docx */ \"docx\");\n/* harmony import */ var docx__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(docx__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! serialize-error */ \"serialize-error\");\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(serialize_error__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! universal-analytics */ \"universal-analytics\");\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(universal_analytics__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\nfunction _objectValues(obj) {\n  var values = [];\n  var keys = Object.keys(obj);\n\n  for (var k = 0; k < keys.length; k++) values.push(obj[keys[k]]);\n\n  return values;\n}\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\n\n\n\n\n\nfunction exportToDoc(_x, _x2) {\n  return _exportToDoc.apply(this, arguments);\n}\n\nfunction _exportToDoc() {\n  _exportToDoc = _asyncToGenerator(function* (request, response) {\n    // ----------------\n    // Google analytics\n    // ----------------\n    const accountId = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().analytics.account_id;\n\n    if (!accountId) {\n      console.warn(\"Google Analytics account ID missing\");\n    }\n\n    const visitor = universal_analytics__WEBPACK_IMPORTED_MODULE_3___default()(accountId);\n\n    try {\n      const id = request.query.id;\n\n      if (!id) {\n        throw new Error(\"Transcript id missing\");\n      }\n\n      const results = yield _database__WEBPACK_IMPORTED_MODULE_4__[\"default\"].getResults(id);\n      const doc = new docx__WEBPACK_IMPORTED_MODULE_0__[\"Document\"]();\n\n      _objectValues(results).map((result, i) => {\n        if (i > 0) {\n          const seconds = result.startTime || 0;\n          const startTime = new Date(seconds * 1000).toISOString().substr(11, 8);\n          doc.addParagraph(new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"]());\n          doc.addParagraph(new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"](startTime));\n          doc.addParagraph(new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"]());\n        }\n\n        const words = result.words.map(word => word.word).join(\" \");\n        doc.addParagraph(new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"](words));\n      });\n\n      const packer = new docx__WEBPACK_IMPORTED_MODULE_0__[\"Packer\"]();\n      const b64string = yield packer.toBase64String(doc);\n      response.setHeader(\"Content-Disposition\", \"attachment; filename=Transcript.docx\");\n      response.send(Buffer.from(b64string, \"base64\"));\n      visitor.event(\"transcript\", \"export generated\", \"docx\").send();\n    } catch (error) {\n      // Log error to console\n      console.error(error); // Log error to Google Analytics\n\n      visitor.exception(error.message, true).send();\n      response.status(500).send(serialize_error__WEBPACK_IMPORTED_MODULE_2___default()(error));\n    }\n  });\n  return _exportToDoc.apply(this, arguments);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (exportToDoc);\n\n//# sourceURL=webpack:///./src/exportToDoc/index.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _exportToDoc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exportToDoc */ \"./src/exportToDoc/index.ts\");\n/* harmony import */ var _transcription__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transcription */ \"./src/transcription/index.ts\");\n/**\n * @file Google Cloud function\n * @author Andreas Schjønhaug\n */\n\n\n // -------------\n// Transcription\n// -------------\n\nexports.transcription = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"region\"](\"europe-west1\").firestore.document(\"transcripts/{transcriptId}\").onCreate(_transcription__WEBPACK_IMPORTED_MODULE_2__[\"default\"]); // -------------\n// Export to doc\n// -------------\n\nexports.exportToDoc = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"region\"](\"europe-west1\").https.onRequest(_exportToDoc__WEBPACK_IMPORTED_MODULE_1__[\"default\"]); // ----------\n// Statistics\n// ----------\n\n/*\nexports.statistics = functions\n  .region(\"europe-west1\")\n  .pubsub.topic(\"transcriptFinished\")\n  .onPublish(statistics)\n*/\n\nprocess.on(\"unhandledRejection\", (reason, promise) => {\n  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`));\n});\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/transcription/helpers.ts":
/*!**************************************!*\
  !*** ./src/transcription/helpers.ts ***!
  \**************************************/
/*! exports provided: hoursMinutesSecondsToSeconds */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hoursMinutesSecondsToSeconds\", function() { return hoursMinutesSecondsToSeconds; });\nfunction hoursMinutesSecondsToSeconds(duration) {\n  const [hours, minutes, seconds] = duration.split(\":\"); // minutes are worth 60 seconds. Hours are worth 60 minutes.\n\n  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);\n}\n\n//# sourceURL=webpack:///./src/transcription/helpers.ts?");

/***/ }),

/***/ "./src/transcription/index.ts":
/*!************************************!*\
  !*** ./src/transcription/index.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! universal-analytics */ \"universal-analytics\");\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(universal_analytics__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\n/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ \"./src/enums.ts\");\n/* harmony import */ var _persistence__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./persistence */ \"./src/transcription/persistence.ts\");\n/* harmony import */ var _transcoding__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./transcoding */ \"./src/transcription/transcoding.ts\");\n/* harmony import */ var _transcribe__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transcribe */ \"./src/transcription/transcribe.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\n\n\n\n\n\n\n\nfunction transcription(_x) {\n  return _transcription.apply(this, arguments);\n}\n\nfunction _transcription() {\n  _transcription = _asyncToGenerator(function* (documentSnapshot\n  /*, eventContext*/\n  ) {\n    console.log(`Deployed 15:53 - Start transcription of id: ${documentSnapshot.id}`); // ----------------\n    // Google analytics\n    // ----------------\n\n    const accountId = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"config\"]().analytics.account_id;\n\n    if (!accountId) {\n      console.warn(\"Google Analytics account ID missing\");\n    }\n\n    const visitor = universal_analytics__WEBPACK_IMPORTED_MODULE_1___default()(accountId);\n\n    try {\n      const startDate = Date.now();\n      const transcriptId = documentSnapshot.id; // Because of indempotency, we need to fetch the transcript from\n      // the server and check if it's already in process\n\n      const step = yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getStep(transcriptId);\n\n      if (step !== _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Uploading) {\n        console.warn(\"Transcript already processed, returning\");\n        return;\n      } // Check for mandatory fields\n\n\n      const transcript = documentSnapshot.data();\n\n      if (transcript === undefined) {\n        throw Error(\"Transcript missing\");\n      } else if (transcript.userId === undefined) {\n        throw Error(\"User id missing\");\n      } else if (transcript.metadata === undefined) {\n        throw Error(\"Metadata missing\");\n      } else if (transcript.metadata.languageCodes === undefined) {\n        throw Error(\"Language codes missing\");\n      } else if (transcript.metadata.originalMimeType === undefined) {\n        throw Error(\"Original mime type missing\");\n      } // Setting user id\n\n\n      visitor.set(\"uid\", transcript.userId); // Setting custom dimensions\n\n      visitor.set(\"cd1\", transcript.metadata.languageCodes.join(\",\"));\n      visitor.set(\"cd2\", transcript.metadata.originalMimeType);\n\n      if (transcript.metadata.industryNaicsCodeOfAudio) {\n        visitor.set(\"cd3\", transcript.metadata.industryNaicsCodeOfAudio);\n      }\n\n      if (transcript.metadata.interactionType) {\n        visitor.set(\"cd4\", transcript.metadata.interactionType);\n      }\n\n      if (transcript.metadata.microphoneDistance) {\n        visitor.set(\"cd5\", transcript.metadata.microphoneDistance);\n      }\n\n      if (transcript.metadata.originalMediaType) {\n        visitor.set(\"cd6\", transcript.metadata.originalMediaType);\n      }\n\n      if (transcript.metadata.recordingDeviceName) {\n        visitor.set(\"cd7\", transcript.metadata.recordingDeviceName);\n      }\n\n      if (transcript.metadata.recordingDeviceType) {\n        visitor.set(\"cd8\", transcript.metadata.recordingDeviceType);\n      } // Setting custom metrics\n\n\n      visitor.set(\"cm1\", transcript.metadata.audioTopic ? transcript.metadata.audioTopic.split(\" \").length : 0);\n      visitor.set(\"cm2\", transcript.metadata.speechContexts ? transcript.metadata.speechContexts[0].phrases.length : 0); // -----------------\n      // Step 1: Transcode\n      // -----------------\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStep(transcriptId, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Transcoding);\n      const {\n        audioDuration,\n        gsUri\n      } = yield Object(_transcoding__WEBPACK_IMPORTED_MODULE_5__[\"transcode\"])(transcriptId, transcript.userId);\n      visitor.set(\"cm3\", Math.round(audioDuration));\n      const transcodedDate = Date.now();\n      const transcodedDuration = transcodedDate - startDate;\n      visitor.set(\"cm5\", Math.round(transcodedDuration / 1000));\n      visitor.event(\"transcription\", \"transcoded\", transcriptId).send();\n      visitor.timing(\"transcription\", \"transcoding\", Math.round(transcodedDuration), transcriptId).send();\n      console.log(\"transcodedDuration\", transcodedDuration); // ------------------\n      // Step 2: Transcribe\n      // ------------------\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStep(transcriptId, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Transcribing);\n      const speechRecognitionResults = yield Object(_transcribe__WEBPACK_IMPORTED_MODULE_6__[\"transcribe\"])(transcriptId, transcript, gsUri);\n      console.log(\"speechRecognitionResults\", speechRecognitionResults);\n      const numberOfWords = speechRecognitionResults.reduce((accumulator, result) => accumulator + result.alternatives[0].transcript.split(\" \").length, 0);\n      console.log(\"Number of words\", numberOfWords);\n      visitor.set(\"cm4\", numberOfWords);\n      const transcribedDate = Date.now();\n      const transcribedDuration = transcribedDate - transcodedDate;\n      visitor.set(\"cm6\", Math.round(transcribedDuration / 1000));\n      visitor.event(\"transcription\", \"transcribed\", transcriptId).send();\n      visitor.timing(\"transcription\", \"transcribing\", Math.round(transcribedDuration), transcriptId).send();\n      console.log(\"transcribedDuration\", transcribedDuration); // ------------\n      // Step 3: Save\n      // ------------\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStep(transcriptId, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Saving);\n      yield Object(_persistence__WEBPACK_IMPORTED_MODULE_4__[\"saveResult\"])(speechRecognitionResults, transcriptId);\n      const savedDate = Date.now();\n      const savedDuration = savedDate - transcribedDate;\n      console.log(\"savedDuration\", savedDuration);\n      visitor.set(\"cm7\", Math.round(savedDuration / 1000));\n      visitor.event(\"transcription\", \"saved\", transcriptId).send();\n      visitor.timing(\"transcription\", \"saving\", Math.round(savedDuration), transcriptId).send();\n      const processDuration = savedDate - startDate;\n      visitor.set(\"cm8\", Math.round(processDuration / 1000));\n      visitor.event(\"transcription\", \"done\", transcriptId, Math.round(audioDuration)).send(); // Done\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStep(transcriptId, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Done);\n    } catch (error) {\n      // Log error to console\n      console.error(error); // Log error to Google Analytics\n\n      visitor.exception(error.message, true).send(); // Log error to database\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].errorOccured(documentSnapshot.id, error);\n      throw error;\n    }\n  });\n  return _transcription.apply(this, arguments);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (transcription);\n\n//# sourceURL=webpack:///./src/transcription/index.ts?");

/***/ }),

/***/ "./src/transcription/persistence.ts":
/*!******************************************!*\
  !*** ./src/transcription/persistence.ts ***!
  \******************************************/
/*! exports provided: saveResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"saveResult\", function() { return saveResult; });\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Saves transcrips to database\n * @author Andreas Schjønhaug\n */\n\nfunction saveResult(_x, _x2) {\n  return _saveResult.apply(this, arguments);\n}\n\nfunction _saveResult() {\n  _saveResult = _asyncToGenerator(function* (speechRecognitionResults, transcriptId) {\n    for (const index of speechRecognitionResults.keys()) {\n      const recognitionResult = speechRecognitionResults[index].alternatives[0];\n      const words = recognitionResult.words.map(wordInfo => {\n        let startTime = 0;\n\n        if (wordInfo.startTime) {\n          if (wordInfo.startTime.seconds) {\n            startTime = parseInt(wordInfo.startTime.seconds, 10) * 1e9;\n          }\n\n          if (wordInfo.startTime.nanos) {\n            startTime += wordInfo.startTime.nanos;\n          }\n        }\n\n        let endTime = 0;\n\n        if (wordInfo.endTime) {\n          if (wordInfo.endTime.seconds) {\n            endTime = parseInt(wordInfo.endTime.seconds, 10) * 1e9;\n          }\n\n          if (wordInfo.endTime.nanos) {\n            endTime += wordInfo.endTime.nanos;\n          }\n        }\n\n        const word = {\n          endTime,\n          startTime,\n          word: wordInfo.word\n        };\n        return word;\n      }); // Transform startTime and endTime's seconds and nanos\n\n      const result = {\n        confidence: recognitionResult.confidence,\n        startTime: words[0].startTime,\n        transcript: recognitionResult.transcript,\n        words\n      };\n      yield _database__WEBPACK_IMPORTED_MODULE_0__[\"default\"].addResult(transcriptId, result);\n\n      if (index + 1 < speechRecognitionResults.length) {\n        const percent = Math.round((index + 1) / speechRecognitionResults.length * 100);\n        yield _database__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setPercent(transcriptId, percent);\n      }\n    }\n  });\n  return _saveResult.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcription/persistence.ts?");

/***/ }),

/***/ "./src/transcription/storage.ts":
/*!**************************************!*\
  !*** ./src/transcription/storage.ts ***!
  \**************************************/
/*! exports provided: storage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"storage\", function() { return storage; });\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/**\n * @file Sets up Storage\n * @author Andreas Schjønhaug\n */\n\n // Only initialise the app once\n\nif (!firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.apps.length) {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.initializeApp(firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().firebase);\n} else {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.app();\n}\n\nconst storage = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.storage();\n\n//# sourceURL=webpack:///./src/transcription/storage.ts?");

/***/ }),

/***/ "./src/transcription/transcoding.ts":
/*!******************************************!*\
  !*** ./src/transcription/transcoding.ts ***!
  \******************************************/
/*! exports provided: transcode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcode\", function() { return transcode; });\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ffmpeg-static */ \"ffmpeg-static\");\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fluent-ffmpeg */ \"fluent-ffmpeg\");\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! os */ \"os\");\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./helpers */ \"./src/transcription/helpers.ts\");\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./storage */ \"./src/transcription/storage.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Converts uploaded audio to mono channel using FFmpeg\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n\n\n\n\n\nlet audioDuration;\n\n/**\n * Utility method to convert audio to mono channel using FFMPEG.\n */\nfunction reencodeToFlacMono(_x, _x2, _x3) {\n  return _reencodeToFlacMono.apply(this, arguments);\n}\n/**\n * Utility method to convert audio to MP4.\n */\n\n\nfunction _reencodeToFlacMono() {\n  _reencodeToFlacMono = _asyncToGenerator(function* (tempFilePath, targetTempFilePath, id) {\n    return new Promise((resolve, reject) => {\n      fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2___default()(tempFilePath).setFfmpegPath(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default.a.path).audioChannels(1).audioFrequency(16000).format(\"flac\").on(\"error\", err => {\n        reject(err);\n      }).on(\"end\", () => {\n        resolve();\n      }).on(\"codecData\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (data) {\n          // Saving duration to database\n          audioDuration = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__[\"hoursMinutesSecondsToSeconds\"])(data.duration);\n\n          try {\n            yield _database__WEBPACK_IMPORTED_MODULE_7__[\"default\"].setDuration(id, audioDuration);\n          } catch (error) {\n            console.log(\"Error in transcoding on('codecData')\");\n            console.error(error);\n          }\n        });\n\n        return function (_x8) {\n          return _ref.apply(this, arguments);\n        };\n      }()).save(targetTempFilePath);\n    });\n  });\n  return _reencodeToFlacMono.apply(this, arguments);\n}\n\nfunction reencodeToM4a(_x4, _x5) {\n  return _reencodeToM4a.apply(this, arguments);\n}\n/**\n * When an audio is uploaded in the Storage bucket we generate a mono channel audio automatically using\n * node-fluent-ffmpeg.\n */\n\n\nfunction _reencodeToM4a() {\n  _reencodeToM4a = _asyncToGenerator(function* (input, output) {\n    return new Promise((resolve, reject) => {\n      fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2___default()(input).setFfmpegPath(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default.a.path).format(\"mp4\").on(\"error\", err => {\n        reject(err);\n      }).on(\"end\", () => {\n        resolve();\n      }).save(output);\n    });\n  });\n  return _reencodeToM4a.apply(this, arguments);\n}\n\nfunction transcode(_x6, _x7) {\n  return _transcode.apply(this, arguments);\n}\n\nfunction _transcode() {\n  _transcode = _asyncToGenerator(function* (transcriptId, userId) {\n    // Getting the bucket reference from Google Cloud Runtime Configuration API\n    const bucketName = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().bucket.name;\n\n    if (bucketName === undefined) {\n      throw Error(\"Environment variable 'bucket.name' not set up\");\n    }\n\n    const bucket = _storage__WEBPACK_IMPORTED_MODULE_9__[\"storage\"].bucket(bucketName); // -----------------------------------\n    // 1. Check that we have an audio file\n    // -----------------------------------\n\n    const mediaPath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(\"media\", userId);\n    const file = bucket.file(path__WEBPACK_IMPORTED_MODULE_5___default.a.join(mediaPath, transcriptId));\n    const [fileMetadata] = yield file.getMetadata();\n    const contentType = fileMetadata.contentType; // Exit if this is triggered on a file that is not an audio.\n\n    if (contentType === undefined || !contentType.startsWith(\"audio/\")) {\n      throw Error(\"Uploaded file is not an audio file\");\n    } // ------------------------------\n    // 2. Download file and transcode\n    // ------------------------------\n\n\n    const tempFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(os__WEBPACK_IMPORTED_MODULE_4___default.a.tmpdir(), transcriptId);\n    yield file.download({\n      destination: tempFilePath\n    });\n    console.log(\"Audio downloaded locally to\", tempFilePath); // Transcode to m4a\n\n    const playbackFileName = `${transcriptId}.m4a`;\n    const playbackTempFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(os__WEBPACK_IMPORTED_MODULE_4___default.a.tmpdir(), playbackFileName);\n    yield reencodeToM4a(tempFilePath, playbackTempFilePath);\n    const playbackStorageFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(mediaPath, playbackFileName);\n    const [playbackFile] = yield bucket.upload(playbackTempFilePath, {\n      destination: playbackStorageFilePath,\n      resumable: false\n    });\n    console.log(\"Uploaded m4a to \", playbackStorageFilePath);\n    yield playbackFile.makePublic();\n    const playbackFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(bucketName, mediaPath, playbackFileName);\n    const playbackUrl = url__WEBPACK_IMPORTED_MODULE_6___default.a.resolve(\"https://storage.googleapis.com\", playbackFilePath);\n    console.log(\"Playback url \", playbackUrl);\n    yield _database__WEBPACK_IMPORTED_MODULE_7__[\"default\"].setPlaybackUrl(transcriptId, playbackUrl); // Transcode to FLAC mono\n\n    const transcribeFileName = `${transcriptId}.flac`;\n    const transcribeTempFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(os__WEBPACK_IMPORTED_MODULE_4___default.a.tmpdir(), transcribeFileName);\n    yield reencodeToFlacMono(tempFilePath, transcribeTempFilePath, transcriptId);\n    const targetStorageFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(mediaPath, transcribeFileName);\n    yield bucket.upload(transcribeTempFilePath, {\n      destination: targetStorageFilePath,\n      resumable: false\n    });\n    console.log(\"Output flac to\", targetStorageFilePath); // Once the audio has been uploaded delete the local file to free up disk space.\n\n    fs__WEBPACK_IMPORTED_MODULE_3___default.a.unlinkSync(tempFilePath);\n    fs__WEBPACK_IMPORTED_MODULE_3___default.a.unlinkSync(playbackTempFilePath);\n    fs__WEBPACK_IMPORTED_MODULE_3___default.a.unlinkSync(transcribeTempFilePath);\n    return {\n      audioDuration,\n      gsUri: `gs://${bucket.name}/${targetStorageFilePath}`\n    };\n  });\n  return _transcode.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcription/transcoding.ts?");

/***/ }),

/***/ "./src/transcription/transcribe.ts":
/*!*****************************************!*\
  !*** ./src/transcription/transcribe.ts ***!
  \*****************************************/
/*! exports provided: transcribe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcribe\", function() { return transcribe; });\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @google-cloud/speech */ \"@google-cloud/speech\");\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Transcripts audio with Google Speech\n * @author Andreas Schjønhaug\n */\n\n\nconst client = new _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default.a.v1p1beta1.SpeechClient();\n\nfunction trans(_x, _x2) {\n  return _trans.apply(this, arguments);\n}\n\nfunction _trans() {\n  _trans = _asyncToGenerator(function* (operation, id) {\n    return new Promise((resolve, reject) => {\n      operation.on(\"complete\", (longRunningRecognizeResponse\n      /*, longRunningRecognizeMetadata, finalApiResponse*/\n      ) => {\n        // Adding a listener for the \"complete\" event starts polling for the\n        // completion of the operation.\n        const speechRecognitionResults = longRunningRecognizeResponse.results;\n        resolve(speechRecognitionResults);\n      }).on(\"progress\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (longRunningRecognizeMetadata\n        /*, apiResponse*/\n        ) {\n          // Adding a listener for the \"progress\" event causes the callback to be\n          // called on any change in metadata when the operation is polled.\n          const percent = longRunningRecognizeMetadata.progressPercent;\n\n          if (percent !== undefined) {\n            try {\n              yield _database__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setPercent(id, percent);\n            } catch (error) {\n              console.log(\"Error in on.('progress')\");\n              console.error(error);\n            }\n          }\n\n          console.log(\"progress\", longRunningRecognizeMetadata\n          /*, apiResponse*/\n          );\n        });\n\n        return function (_x6) {\n          return _ref.apply(this, arguments);\n        };\n      }()).on(\"error\", error => {\n        // Adding a listener for the \"error\" event handles any errors found during polling.\n        reject(error);\n      });\n    });\n  });\n  return _trans.apply(this, arguments);\n}\n\nfunction transcribe(_x3, _x4, _x5) {\n  return _transcribe.apply(this, arguments);\n}\n\nfunction _transcribe() {\n  _transcribe = _asyncToGenerator(function* (id, transcript, uri) {\n    if (!transcript.metadata || !transcript.metadata.languageCodes || transcript.metadata.languageCodes.length === 0) {\n      throw new Error(\"Language codes missing\");\n    }\n\n    const languageCode = transcript.metadata.languageCodes.shift();\n    const enableAutomaticPunctuation = languageCode === \"en-US\"; // Only working for en-US at the moment\n\n    const recognitionRequest = {\n      audio: {\n        uri\n      },\n      config: {\n        enableAutomaticPunctuation,\n        enableWordTimeOffsets: true,\n        languageCode,\n        metadata: transcript.metadata,\n        useEnhanced: true\n      }\n    };\n\n    if (transcript.metadata.languageCodes.length > 0) {\n      recognitionRequest.config.alternativeLanguageCodes = transcript.metadata.languageCodes;\n    }\n\n    console.log(\"Start transcribing\", id, recognitionRequest); // Detects speech in the audio file. This creates a recognition job that you\n    // can wait for now, or get its result later.\n\n    const responses = yield client.longRunningRecognize(recognitionRequest);\n    const operation = responses[0];\n    console.log(\"operation\", operation);\n    const speechRecognitionResults = yield trans(operation, id);\n    return speechRecognitionResults;\n  });\n  return _transcribe.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcription/transcribe.ts?");

/***/ }),

/***/ "@google-cloud/speech":
/*!***************************************!*\
  !*** external "@google-cloud/speech" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@google-cloud/speech\");\n\n//# sourceURL=webpack:///external_%22@google-cloud/speech%22?");

/***/ }),

/***/ "docx":
/*!***********************!*\
  !*** external "docx" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"docx\");\n\n//# sourceURL=webpack:///external_%22docx%22?");

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

/***/ }),

/***/ "serialize-error":
/*!**********************************!*\
  !*** external "serialize-error" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"serialize-error\");\n\n//# sourceURL=webpack:///external_%22serialize-error%22?");

/***/ }),

/***/ "universal-analytics":
/*!**************************************!*\
  !*** external "universal-analytics" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"universal-analytics\");\n\n//# sourceURL=webpack:///external_%22universal-analytics%22?");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"url\");\n\n//# sourceURL=webpack:///external_%22url%22?");

/***/ })

/******/ });