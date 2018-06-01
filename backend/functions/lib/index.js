"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const speech = require("@google-cloud/speech");
const ffmpegStatic = require("ffmpeg-static");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const os = require("os");
const path = require("path");
const enums_1 = require("./enums");
admin.initializeApp(functions.config().firebase);
const client = new speech.v1p1beta1.SpeechClient();
const database = admin.database();
///////////////////
// TRANSCRIPTION //
///////////////////
function saveResult(speechRecognitionResults, id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("length", speechRecognitionResults.length);
        yield updateTranscript(id, {
            progress: {
                percent: 0,
                status: "saving"
            },
            "timestamps/transcribedAt": admin.database.ServerValue.TIMESTAMP
        });
        // Flattening the structure
        for (const index of speechRecognitionResults.keys()) {
            const words = speechRecognitionResults[index].alternatives[0].words;
            database
                .ref(`/transcripts/${id}/text`)
                .push(JSON.parse(JSON.stringify(words)));
            const percent = Math.round((index + 1) / speechRecognitionResults.length * 100);
            if (index + 1 < speechRecognitionResults.length) {
                yield updateTranscript(id, {
                    "progress/percent": percent
                });
            }
            else {
                yield updateTranscript(id, {
                    progress: { status: "success" },
                    "timestamps/savedAt": admin.database.ServerValue.TIMESTAMP
                });
            }
        }
    });
}
function trans(operation, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Adding a listener for the "complete" event starts polling for the
            // completion of the operation.
            operation.on("complete", (longRunningRecognizeResponse, longRunningRecognizeMetadata, finalApiResponse) => {
                const speechRecognitionResults = longRunningRecognizeResponse.results;
                resolve(speechRecognitionResults);
            });
            // Adding a listener for the "progress" event causes the callback to be
            // called on any change in metadata when the operation is polled.
            operation.on("progress", (longRunningRecognizeMetadata, apiResponse) => __awaiter(this, void 0, void 0, function* () {
                const percent = longRunningRecognizeMetadata.progressPercent;
                if (percent !== undefined) {
                    yield updateTranscript(id, {
                        "progress/percent": percent
                    });
                }
                console.log("progress", longRunningRecognizeMetadata, apiResponse);
            }));
            // Adding a listener for the "error" event handles any errors found during polling.
            operation.on("error", (error) => {
                reject(error);
            });
        });
    });
}
function transcribe(id, gcsUri, languageCode) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Start transcribing", id, languageCode);
        yield updateTranscript(id, {
            progress: { status: "transcribing", percent: 0 },
            "timestamps/transcodedAt": admin.database.ServerValue.TIMESTAMP
        });
        const request = {
            audio: { uri: gcsUri },
            config: {
                enableAutomaticPunctuation: true,
                enableWordTimeOffsets: true,
                languageCode
            }
        };
        // Detects speech in the audio file. This creates a recognition job that you
        // can wait for now, or get its result later.
        const responses = yield client.longRunningRecognize(request);
        const operation = responses[0];
        console.log("operation", operation);
        const speechRecognitionResults = yield trans(operation, id);
        return speechRecognitionResults;
    });
}
/////////////
// HELPERS //
/////////////
function hoursMinutesSecondsToSeconds(duration) {
    const [hours, minutes, seconds] = duration.split(":");
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
}
function updateTranscript(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database.ref(`/transcripts/${id}`).update(Object.assign({}, data));
    });
}
/////////////////
// TRANSCODING //
/////////////////
/**
 * Utility method to convert audio to mono channel using FFMPEG.
 */
function reencodeAsync(tempFilePath, targetTempFilePath, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const command = ffmpeg(tempFilePath)
                .setFfmpegPath(ffmpegStatic.path)
                .audioChannels(1)
                .audioFrequency(16000)
                .format("flac")
                .on("error", err => {
                reject(err);
            })
                .on("end", () => {
                resolve();
            })
                .on("codecData", (data) => __awaiter(this, void 0, void 0, function* () {
                // Saving duration to database
                const durationInSeconds = hoursMinutesSecondsToSeconds(data.duration);
                try {
                    yield updateTranscript(id, {
                        "audioFile/durationInSeconds": durationInSeconds
                    });
                }
                catch (error) {
                    console.error(error);
                }
            }))
                .save(targetTempFilePath);
        });
    });
}
/**
 * When an audio is uploaded in the Storage bucket We generate a mono channel audio automatically using
 * node-fluent-ffmpeg.
 */
function transcodeAudio(languageCode, id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Getting the bucket reference from Google Cloud Runtime Configuration API
        const uploadsBucketReference = functions.config().bucket.uploads;
        if (uploadsBucketReference === undefined) {
            throw Error("Environment variable 'bucket.upload' not set up");
        }
        const uploadsBucket = admin.storage().bucket(uploadsBucketReference);
        // Write status to Firebase
        yield updateTranscript(id, {
            progress: { status: "transcoding" }
        });
        /*const fileBucket = objectMetaData.bucket // The Storage bucket that contains the file.
        const contentType = objectMetaData.contentType // File content type.
      
        // Exit if this is triggered on a file that is not an audio.
        if (contentType === undefined || !contentType.startsWith("audio/")) {
          throw Error("Uploaded file is not audio")
        }
      */
        // Get the file name.
        const fileName = path.basename(id);
        // Download file from uploads bucket.
        const tempFilePath = path.join(os.tmpdir(), fileName);
        // We add a '.flac' suffix to target audio file name. That's where we'll upload the converted audio.
        const targetTempFileName = fileName.replace(/\.[^/.]+$/, "") + ".flac";
        const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
        const targetStorageFilePath = path.join(path.dirname(id), targetTempFileName);
        yield uploadsBucket.file(id).download({ destination: tempFilePath });
        console.log("Audio downloaded locally to", tempFilePath);
        // Convert the audio to mono channel using FFMPEG.
        yield reencodeAsync(tempFilePath, targetTempFilePath, id);
        console.log("Output audio created at", targetTempFilePath);
        // Getting the bucket reference from Google Cloud Runtime Configuration API
        const transcodedBucketReference = functions.config().bucket.transcoded;
        if (transcodedBucketReference === undefined) {
            throw Error("Environment variable 'bucket.transcoded' not set up");
        }
        const transcodedBucket = admin.storage().bucket(transcodedBucketReference);
        // Uploading the audio to transcoded bucket.
        const [transcodedFile] = yield transcodedBucket.upload(targetTempFilePath, {
            destination: targetStorageFilePath,
            resumable: false
        });
        console.log("Output audio uploaded to", targetStorageFilePath);
        // Once the audio has been uploaded delete the local file to free up disk space.
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(targetTempFilePath);
        console.log("Temporary files removed.", targetTempFilePath);
        // Finally, transcribe the transcoded audio file
        console.log(transcodedFile);
        if (transcodedFile.metadata === undefined) {
            throw new Error("Metadata missing on transcoded file");
        }
        const bucket = transcodedFile.metadata.bucket;
        const name = transcodedFile.metadata.name;
        const gcsUri = `gs://${bucket}/${name}`;
        return gcsUri;
    });
}
exports.transcription = functions.database
    .ref("/transcripts/{id}")
    .onCreate((dataSnapshot, eventContext) => __awaiter(this, void 0, void 0, function* () {
    const id = dataSnapshot.key;
    try {
        const transcript = dataSnapshot.val();
        if (transcript === undefined) {
            throw Error("Transcript missing");
        }
        const languageCode = transcript.audioFile.languageCode;
        console.log(`Deployed 28. mai 11:12 - Start transcription of id ${id} with ${languageCode} `);
        // First, check if status is "uploaded", otherwise, cancel
        if (transcript.progress.status !== enums_1.Status.Uploaded) {
            console.error("Transcript already processed");
            return null;
        }
        // 1. Transcode
        const gcsUri = yield transcodeAudio(languageCode, id);
        // 2. Transcribe
        const speechRecognitionResults = yield transcribe(id, gcsUri, languageCode);
        // 3. Save transcription
        yield saveResult(speechRecognitionResults, id);
        console.log("End transcribing", id);
    }
    catch (error) {
        console.error(error);
        yield updateTranscript(id, {
            error: JSON.parse(JSON.stringify(error)),
            progress: {
                percent: null,
                status: "failed"
            }
        });
        return null;
    }
}));
process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at: Promise", promise, "reason:", reason);
    console.log(reason.stack);
    // application specific logging, throwing an error, or other logic here
});
//# sourceMappingURL=index.js.map