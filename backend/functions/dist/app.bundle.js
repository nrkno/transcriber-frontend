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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! serialize-error */ \"serialize-error\");\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(serialize_error__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enums */ \"./src/enums.ts\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Sets up Firebase\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n// Only initialise the app once\nif (!firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.apps.length) {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.initializeApp(firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().firebase);\n} else {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.app();\n}\n\nconst db = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.firestore();\nconst settings = {\n  timestampsInSnapshots: true\n};\ndb.settings(settings);\n\nconst database = (() => {\n  const updateTranscript =\n  /*#__PURE__*/\n  function () {\n    var _ref = _asyncToGenerator(function* (id, transcript) {\n      return db.doc(`transcripts/${id}`).set(_objectSpread({}, transcript), {\n        merge: true\n      });\n    });\n\n    return function updateTranscript(_x, _x2) {\n      return _ref.apply(this, arguments);\n    };\n  }();\n\n  const setStatus =\n  /*#__PURE__*/\n  function () {\n    var _ref2 = _asyncToGenerator(function* (id, status) {\n      const transcript = {\n        progress: {\n          status\n        },\n        timestamps: {\n          [`${status}`]: firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.firestore.Timestamp.now()\n        } // We get completion percentages when transcribing and saving, so setting them to zero.\n\n      };\n\n      if (status === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Transcribing || status === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Saving) {\n        transcript.progress.percent = 0;\n      } else {\n        transcript.progress.percent = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.firestore.FieldValue.delete();\n      }\n\n      return updateTranscript(id, transcript);\n    });\n\n    return function setStatus(_x3, _x4) {\n      return _ref2.apply(this, arguments);\n    };\n  }();\n\n  const setPercent =\n  /*#__PURE__*/\n  function () {\n    var _ref3 = _asyncToGenerator(function* (id, percent) {\n      const transcript = {\n        progress: {\n          percent\n        }\n      };\n      return updateTranscript(id, transcript);\n    });\n\n    return function setPercent(_x5, _x6) {\n      return _ref3.apply(this, arguments);\n    };\n  }();\n\n  const addResult =\n  /*#__PURE__*/\n  function () {\n    var _ref4 = _asyncToGenerator(function* (id, result) {\n      // We insert the start time of the first word, it will be used to sort the results\n      const startTime = parseInt(result.words[0].startTime.seconds, 10) || 0;\n\n      const resultWithStartTimeInSeconds = _objectSpread({}, result, {\n        startTime\n      });\n\n      const data = JSON.parse(JSON.stringify(resultWithStartTimeInSeconds));\n      return db.collection(`transcripts/${id}/results`).add(data);\n    });\n\n    return function addResult(_x7, _x8) {\n      return _ref4.apply(this, arguments);\n    };\n  }();\n\n  const setDuration =\n  /*#__PURE__*/\n  function () {\n    var _ref5 = _asyncToGenerator(function* (id, seconds) {\n      const transcript = {\n        duration: seconds\n      };\n      return updateTranscript(id, transcript);\n    });\n\n    return function setDuration(_x9, _x10) {\n      return _ref5.apply(this, arguments);\n    };\n  }();\n\n  const errorOccured =\n  /*#__PURE__*/\n  function () {\n    var _ref6 = _asyncToGenerator(function* (id, error) {\n      const transcript = {\n        error: serialize_error__WEBPACK_IMPORTED_MODULE_2___default()(error),\n        progress: {\n          status: _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Failed\n        }\n      };\n      return updateTranscript(id, transcript);\n    });\n\n    return function errorOccured(_x11, _x12) {\n      return _ref6.apply(this, arguments);\n    };\n  }();\n\n  const getResults =\n  /*#__PURE__*/\n  function () {\n    var _ref7 = _asyncToGenerator(function* (id) {\n      const querySnapshot = yield db.collection(`transcripts/${id}/results`).orderBy(\"startTime\").get();\n      const results = Array();\n      querySnapshot.forEach(doc => {\n        const result = doc.data();\n        results.push(result);\n      });\n      return results;\n    });\n\n    return function getResults(_x13) {\n      return _ref7.apply(this, arguments);\n    };\n  }();\n\n  const getStatus =\n  /*#__PURE__*/\n  function () {\n    var _ref8 = _asyncToGenerator(function* (id) {\n      const doc = yield db.doc(`transcripts/${id}`).get();\n      const transcript = doc.data();\n      return transcript.progress.status;\n    });\n\n    return function getStatus(_x14) {\n      return _ref8.apply(this, arguments);\n    };\n  }();\n\n  return {\n    addResult,\n    errorOccured,\n    setDuration,\n    setStatus,\n    setPercent,\n    getStatus,\n    getResults\n  };\n})();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (database);\n\n//# sourceURL=webpack:///./src/database.ts?");

/***/ }),

/***/ "./src/enums.ts":
/*!**********************!*\
  !*** ./src/enums.ts ***!
  \**********************/
/*! exports provided: Status, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, AudioEncoding */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Status\", function() { return Status; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"InteractionType\", function() { return InteractionType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MicrophoneDistance\", function() { return MicrophoneDistance; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"OriginalMediaType\", function() { return OriginalMediaType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RecordingDeviceType\", function() { return RecordingDeviceType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AudioEncoding\", function() { return AudioEncoding; });\nlet Status; // Use case categories that the audio recognition request can be described by.\n\n(function (Status) {\n  Status[\"Uploading\"] = \"UPLOADING\";\n  Status[\"Analysing\"] = \"ANALYSING\";\n  Status[\"Transcoding\"] = \"TRANSCODING\";\n  Status[\"Transcribing\"] = \"TRANSCRIBING\";\n  Status[\"Saving\"] = \"SAVING\";\n  Status[\"Success\"] = \"SUCCESS\";\n  Status[\"Failed\"] = \"FAILED\";\n})(Status || (Status = {}));\n\nlet InteractionType;\n\n(function (InteractionType) {\n  InteractionType[\"Unspecified\"] = \"INTERACTION_TYPE_UNSPECIFIED\";\n  InteractionType[\"Discussion\"] = \"DISCUSSION\";\n  InteractionType[\"Presentaton\"] = \"PRESENTATION\";\n  InteractionType[\"PhoneCall\"] = \"PHONE_CALL\";\n  InteractionType[\"Voicemail\"] = \"VOICEMAIL\";\n  InteractionType[\"ProfessionallyProduced\"] = \"PROFESSIONALLY_PRODUCED\";\n  InteractionType[\"Dictation\"] = \"DICTATION\";\n})(InteractionType || (InteractionType = {}));\n\n// Enumerates the types of capture settings describing an audio file.\nlet MicrophoneDistance;\n\n(function (MicrophoneDistance) {\n  MicrophoneDistance[\"Unspecified\"] = \"MICROPHONE_DISTANCE_UNSPECIFIED\";\n  MicrophoneDistance[\"Nearfield\"] = \"NEARFIELD\";\n  MicrophoneDistance[\"Midfield\"] = \"MIDFIELD\";\n  MicrophoneDistance[\"Farfield\"] = \"FARFIELD\";\n})(MicrophoneDistance || (MicrophoneDistance = {}));\n\n// The original media the speech was recorded on.\nlet OriginalMediaType;\n\n(function (OriginalMediaType) {\n  OriginalMediaType[\"Unspecified\"] = \"ORIGINAL_MEDIA_TYPE_UNSPECIFIED\";\n  OriginalMediaType[\"Audio\"] = \"AUDIO\";\n  OriginalMediaType[\"Video\"] = \"VIDEO\";\n})(OriginalMediaType || (OriginalMediaType = {}));\n\n// The type of device the speech was recorded with.\nlet RecordingDeviceType;\n\n(function (RecordingDeviceType) {\n  RecordingDeviceType[\"Unspecified\"] = \"RECORDING_DEVICE_TYPE_UNSPECIFIED\";\n  RecordingDeviceType[\"Smartphone\"] = \"SMARTPHONE\";\n  RecordingDeviceType[\"PC\"] = \"PC\";\n  RecordingDeviceType[\"PhoneLine\"] = \"PHONE_LINE\";\n  RecordingDeviceType[\"Vehicle\"] = \"VEHICLE\";\n  RecordingDeviceType[\"OtherOutdoorDevice\"] = \"OTHER_OUTDOOR_DEVICE\";\n  RecordingDeviceType[\"OtherIndoorDevice\"] = \"OTHER_INDOOR_DEVICE\";\n})(RecordingDeviceType || (RecordingDeviceType = {}));\n\n// The encoding of the audio data sent in the request.\nlet AudioEncoding;\n\n(function (AudioEncoding) {\n  AudioEncoding[\"Unspecified\"] = \"ENCODING_UNSPECIFIED\";\n  AudioEncoding[\"Linear16\"] = \"LINEAR16\";\n  AudioEncoding[\"Flac\"] = \"FLAC\";\n  AudioEncoding[\"Mulaw\"] = \"MULAW\";\n  AudioEncoding[\"Amr\"] = \"AMR\";\n  AudioEncoding[\"AmrWb\"] = \"AMR_WB\";\n  AudioEncoding[\"OggOpus\"] = \"OGG_OPUS\";\n  AudioEncoding[\"SpeedxWithHeaderByte\"] = \"SPEEX_WITH_HEADER_BYTE\";\n})(AudioEncoding || (AudioEncoding = {}));\n\n//# sourceURL=webpack:///./src/enums.ts?");

/***/ }),

/***/ "./src/exportToDoc/index.ts":
/*!**********************************!*\
  !*** ./src/exportToDoc/index.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var docx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! docx */ \"docx\");\n/* harmony import */ var docx__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(docx__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\nfunction _objectValues(obj) {\n  var values = [];\n  var keys = Object.keys(obj);\n\n  for (var k = 0; k < keys.length; k++) values.push(obj[keys[k]]);\n\n  return values;\n}\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\n\n\nfunction exportToDoc(_x, _x2) {\n  return _exportToDoc.apply(this, arguments);\n}\n\nfunction _exportToDoc() {\n  _exportToDoc = _asyncToGenerator(function* (id, response) {\n    console.log(id);\n    const results = yield _database__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getResults(id);\n    const doc = new docx__WEBPACK_IMPORTED_MODULE_0__[\"Document\"]();\n\n    _objectValues(results).map((result, i) => {\n      if (i > 0) {\n        const seconds = result.startTime || 0;\n        const startTime = new Date(seconds * 1000).toISOString().substr(11, 8);\n        doc.addParagraph(new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"]());\n        doc.addParagraph(new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"](startTime));\n        doc.addParagraph(new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"]());\n      }\n\n      const words = result.words.map(word => word.word).join(\" \");\n      doc.addParagraph(new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"](words));\n    });\n\n    const packer = new docx__WEBPACK_IMPORTED_MODULE_0__[\"Packer\"]();\n    const b64string = yield packer.toBase64String(doc);\n    response.setHeader(\"Content-Disposition\", \"attachment; filename=Transcript.docx\");\n    response.send(Buffer.from(b64string, \"base64\"));\n  });\n  return _exportToDoc.apply(this, arguments);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (exportToDoc);\n\n//# sourceURL=webpack:///./src/exportToDoc/index.ts?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! serialize-error */ \"serialize-error\");\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(serialize_error__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\n/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enums */ \"./src/enums.ts\");\n/* harmony import */ var _exportToDoc__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./exportToDoc */ \"./src/exportToDoc/index.ts\");\n/* harmony import */ var _persistence__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./persistence */ \"./src/persistence.ts\");\n/* harmony import */ var _transcoding__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transcoding */ \"./src/transcoding.ts\");\n/* harmony import */ var _transcription__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./transcription */ \"./src/transcription.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Google Cloud function\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n\n\n\nexports.transcription = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"region\"](\"europe-west1\").firestore.document(\"transcripts/{transcriptId}\").onCreate(\n/*#__PURE__*/\nfunction () {\n  var _ref = _asyncToGenerator(function* (documentSnapshot, eventContext) {\n    const id = documentSnapshot.id;\n    console.log(`Deployed 18:34 - Start transcription of id: ${id}`);\n\n    try {\n      // Because of indempotency, we need to fetch the transcript from the server and check if it's already in process\n      const status = yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getStatus(id);\n\n      if (status !== _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Uploading) {\n        console.warn(\"Transcript already processed, returning\");\n        return;\n      }\n\n      const transcript = documentSnapshot.data();\n\n      if (transcript === undefined) {\n        throw Error(\"Transcript missing\");\n      }\n\n      const languageCodes = transcript.languageCodes; // 1. Transcode\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStatus(id, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Transcoding);\n      const uri = yield Object(_transcoding__WEBPACK_IMPORTED_MODULE_6__[\"transcode\"])(id); // 2. Transcribe\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStatus(id, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Transcribing);\n      const speechRecognitionResults = yield Object(_transcription__WEBPACK_IMPORTED_MODULE_7__[\"transcribe\"])(id, transcript, uri); // 3. Save transcription\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStatus(id, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Saving);\n      yield Object(_persistence__WEBPACK_IMPORTED_MODULE_5__[\"saveResult\"])(speechRecognitionResults, id); // 4. Done\n\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].setStatus(id, _enums__WEBPACK_IMPORTED_MODULE_3__[\"Status\"].Success);\n      console.log(\"End transcribing with id: \", id);\n    } catch (error) {\n      console.log(\"Error in main function\");\n      console.error(error);\n      yield _database__WEBPACK_IMPORTED_MODULE_2__[\"default\"].errorOccured(id, error);\n      throw error;\n    }\n  });\n\n  return function (_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}());\nexports.exportToDoc = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"region\"](\"europe-west1\").https.onRequest(\n/*#__PURE__*/\nfunction () {\n  var _ref2 = _asyncToGenerator(function* (request, response) {\n    try {\n      console.log(\"export 17:37\");\n\n      if (!request.query.id) {\n        throw new Error(\"ID missing\");\n      }\n\n      yield Object(_exportToDoc__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(request.query.id, response);\n    } catch (error) {\n      // Handle the error\n      console.log(error);\n      response.status(500).send(serialize_error__WEBPACK_IMPORTED_MODULE_1___default()(error));\n    }\n  });\n\n  return function (_x3, _x4) {\n    return _ref2.apply(this, arguments);\n  };\n}());\nprocess.on(\"unhandledRejection\", (reason, promise) => {\n  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`));\n});\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/persistence.ts":
/*!****************************!*\
  !*** ./src/persistence.ts ***!
  \****************************/
/*! exports provided: saveResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"saveResult\", function() { return saveResult; });\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Saves transcrips to database\n * @author Andreas Schjønhaug\n */\n\nfunction saveResult(_x, _x2) {\n  return _saveResult.apply(this, arguments);\n}\n\nfunction _saveResult() {\n  _saveResult = _asyncToGenerator(function* (speechRecognitionResults, id) {\n    console.log(speechRecognitionResults);\n    console.log(\"length\", speechRecognitionResults.length); // Flattening the structure\n\n    for (const index of speechRecognitionResults.keys()) {\n      const result = speechRecognitionResults[index].alternatives[0];\n      console.log(result);\n      yield _database__WEBPACK_IMPORTED_MODULE_0__[\"default\"].addResult(id, result);\n      const percent = Math.round((index + 1) / speechRecognitionResults.length * 100);\n\n      if (index + 1 < speechRecognitionResults.length) {\n        yield _database__WEBPACK_IMPORTED_MODULE_0__[\"default\"].setPercent(id, percent);\n      }\n    }\n  });\n  return _saveResult.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/persistence.ts?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcode\", function() { return transcode; });\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ffmpeg-static */ \"ffmpeg-static\");\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fluent-ffmpeg */ \"fluent-ffmpeg\");\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! os */ \"os\");\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.ts\");\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./storage */ \"./src/storage.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Converts uploaded audio to mono channel using FFmpeg\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n\n\n\n\n/**\n * Utility method to convert audio to mono channel using FFMPEG.\n */\n\nfunction reencodeToMono(_x, _x2, _x3) {\n  return _reencodeToMono.apply(this, arguments);\n}\n/**\n * When an audio is uploaded in the Storage bucket we generate a mono channel audio automatically using\n * node-fluent-ffmpeg.\n */\n\n\nfunction _reencodeToMono() {\n  _reencodeToMono = _asyncToGenerator(function* (tempFilePath, targetTempFilePath, id) {\n    return new Promise((resolve, reject) => {\n      fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_2___default()(tempFilePath).setFfmpegPath(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default.a.path).audioChannels(1).audioFrequency(16000).format(\"flac\").on(\"error\", err => {\n        reject(err);\n      }).on(\"end\", () => {\n        resolve();\n      }).on(\"codecData\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (data) {\n          // Saving duration to database\n          const duration = Object(_helpers__WEBPACK_IMPORTED_MODULE_7__[\"hoursMinutesSecondsToSeconds\"])(data.duration);\n\n          try {\n            yield _database__WEBPACK_IMPORTED_MODULE_6__[\"default\"].setDuration(id, duration);\n          } catch (error) {\n            console.log(\"Error in transcoding on('codecData')\");\n            console.error(error);\n          }\n        });\n\n        return function (_x5) {\n          return _ref.apply(this, arguments);\n        };\n      }()).save(targetTempFilePath);\n    });\n  });\n  return _reencodeToMono.apply(this, arguments);\n}\n\nfunction transcode(_x4) {\n  return _transcode.apply(this, arguments);\n}\n\nfunction _transcode() {\n  _transcode = _asyncToGenerator(function* (id) {\n    // Getting the bucket reference from Google Cloud Runtime Configuration API\n    const uploadsBucketReference = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().bucket.uploads;\n\n    if (uploadsBucketReference === undefined) {\n      throw Error(\"Environment variable 'bucket.upload' not set up\");\n    }\n\n    const uploadsBucket = _storage__WEBPACK_IMPORTED_MODULE_8__[\"storage\"].bucket(uploadsBucketReference);\n    /*const fileBucket = objectMetaData.bucket // The Storage bucket that contains the file.\n      const contentType = objectMetaData.contentType // File content type.\n    \n      // Exit if this is triggered on a file that is not an audio.\n      if (contentType === undefined || !contentType.startsWith(\"audio/\")) {\n        throw Error(\"Uploaded file is not audio\")\n      }\n    */\n    // Get the file name.\n\n    const fileName = path__WEBPACK_IMPORTED_MODULE_5___default.a.basename(id); // Download file from uploads bucket.\n\n    const tempFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(os__WEBPACK_IMPORTED_MODULE_4___default.a.tmpdir(), fileName); // We add a '.flac' suffix to target audio file name. That's where we'll upload the converted audio.\n\n    const targetTempFileName = fileName.replace(/\\.[^/.]+$/, \"\") + \".flac\";\n    const targetTempFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(os__WEBPACK_IMPORTED_MODULE_4___default.a.tmpdir(), targetTempFileName);\n    const targetStorageFilePath = path__WEBPACK_IMPORTED_MODULE_5___default.a.join(path__WEBPACK_IMPORTED_MODULE_5___default.a.dirname(id), targetTempFileName);\n    yield uploadsBucket.file(id).download({\n      destination: tempFilePath\n    });\n    console.log(\"Audio downloaded locally to\", tempFilePath); // Convert the audio to mono channel using FFMPEG.\n\n    yield reencodeToMono(tempFilePath, targetTempFilePath, id);\n    console.log(\"Output audio created at\", targetTempFilePath); // Getting the bucket reference from Google Cloud Runtime Configuration API\n\n    const transcodedBucketReference = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().bucket.transcoded;\n\n    if (transcodedBucketReference === undefined) {\n      throw Error(\"Environment variable 'bucket.transcoded' not set up\");\n    }\n\n    const transcodedBucket = _storage__WEBPACK_IMPORTED_MODULE_8__[\"storage\"].bucket(transcodedBucketReference); // Uploading the audio to transcoded bucket.\n\n    const [transcodedFile] = yield transcodedBucket.upload(targetTempFilePath, {\n      destination: targetStorageFilePath,\n      resumable: false\n    });\n    console.log(\"Output audio uploaded to\", targetStorageFilePath); // Once the audio has been uploaded delete the local file to free up disk space.\n\n    fs__WEBPACK_IMPORTED_MODULE_3___default.a.unlinkSync(tempFilePath);\n    fs__WEBPACK_IMPORTED_MODULE_3___default.a.unlinkSync(targetTempFilePath);\n    console.log(\"Temporary files removed.\", targetTempFilePath); // Finally, transcribe the transcoded audio file\n\n    console.log(transcodedFile);\n\n    if (transcodedFile.metadata === undefined) {\n      throw new Error(\"Metadata missing on transcoded file\");\n    }\n\n    const bucket = transcodedFile.metadata.bucket;\n    const name = transcodedFile.metadata.name;\n\n    if (bucket === undefined || name === undefined) {\n      throw new Error(\"Error in metadata on transcoded file\");\n    }\n\n    return `gs://${bucket}/${name}`;\n  });\n  return _transcode.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcoding.ts?");

/***/ }),

/***/ "./src/transcription.ts":
/*!******************************!*\
  !*** ./src/transcription.ts ***!
  \******************************/
/*! exports provided: transcribe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcribe\", function() { return transcribe; });\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @google-cloud/speech */ \"@google-cloud/speech\");\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./database */ \"./src/database.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Transcripts audio with Google Speech\n * @author Andreas Schjønhaug\n */\n\n\nconst client = new _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default.a.v1p1beta1.SpeechClient();\n\nfunction trans(_x, _x2) {\n  return _trans.apply(this, arguments);\n}\n\nfunction _trans() {\n  _trans = _asyncToGenerator(function* (operation, id) {\n    return new Promise((resolve, reject) => {\n      operation.on(\"complete\", (longRunningRecognizeResponse\n      /*, longRunningRecognizeMetadata, finalApiResponse*/\n      ) => {\n        // Adding a listener for the \"complete\" event starts polling for the\n        // completion of the operation.\n        const speechRecognitionResults = longRunningRecognizeResponse.results;\n        resolve(speechRecognitionResults);\n      }).on(\"progress\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (longRunningRecognizeMetadata\n        /*, apiResponse*/\n        ) {\n          // Adding a listener for the \"progress\" event causes the callback to be\n          // called on any change in metadata when the operation is polled.\n          const percent = longRunningRecognizeMetadata.progressPercent;\n\n          if (percent !== undefined) {\n            try {\n              yield _database__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setPercent(id, percent);\n            } catch (error) {\n              console.log(\"Error in on.('progress')\");\n              console.error(error);\n            }\n          }\n\n          console.log(\"progress\", longRunningRecognizeMetadata\n          /*, apiResponse*/\n          );\n        });\n\n        return function (_x6) {\n          return _ref.apply(this, arguments);\n        };\n      }()).on(\"error\", error => {\n        // Adding a listener for the \"error\" event handles any errors found during polling.\n        reject(error);\n      });\n    });\n  });\n  return _trans.apply(this, arguments);\n}\n\nfunction transcribe(_x3, _x4, _x5) {\n  return _transcribe.apply(this, arguments);\n}\n\nfunction _transcribe() {\n  _transcribe = _asyncToGenerator(function* (id, transcript, uri) {\n    if (!transcript.languageCodes || transcript.languageCodes.length === 0) {\n      throw new Error(\"Language codes missing\");\n    }\n\n    if (!transcript.audioUrls) {\n      throw new Error(\"Audio URLs missing\");\n    }\n\n    const languageCode = transcript.languageCodes.shift();\n    const enableAutomaticPunctuation = languageCode === \"en-US\"; // Only working for en-US at the moment\n\n    const recognitionRequest = {\n      audio: {\n        uri\n      },\n      config: {\n        enableAutomaticPunctuation,\n        enableWordTimeOffsets: true,\n        languageCode,\n        metadata: transcript.recognitionMetadata,\n        useEnhanced: true\n      }\n    };\n\n    if (transcript.languageCodes.length > 0) {\n      recognitionRequest.config.alternativeLanguageCodes = transcript.languageCodes;\n    }\n\n    console.log(\"Start transcribing\", id, recognitionRequest); // Detects speech in the audio file. This creates a recognition job that you\n    // can wait for now, or get its result later.\n\n    const responses = yield client.longRunningRecognize(recognitionRequest);\n    const operation = responses[0];\n    console.log(\"operation\", operation);\n    const speechRecognitionResults = yield trans(operation, id);\n    return speechRecognitionResults;\n  });\n  return _transcribe.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcription.ts?");

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

/***/ })

/******/ });