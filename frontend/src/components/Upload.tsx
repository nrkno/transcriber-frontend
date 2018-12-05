import firebase from "firebase/app"
import * as React from "react"
import Dropzone, { DropFilesEventHandler } from "react-dropzone"
/* Testing not working with normal import right now, see https://github.com/react-dropzone/react-dropzone/issues/554
let Dropzone = require("react-dropzone")
if ("default" in Dropzone) {
  Dropzone = Dropzone.default
}*/
import ReactGA from "react-ga"
import { Progress } from "react-sweet-progress"
import "react-sweet-progress/lib/style.css"
import { InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, Step, Timestamp } from "../enums"
import { database, storage } from "../firebaseApp"
import { IMetadata, ITranscript } from "../interfaces"

interface IState {
  file?: File
  dropzoneMessage?: string
  transcript: ITranscript
}

interface IProps {
  user?: firebase.User
}

class Upload extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)

    this.state = {
      transcript: {
        metadata: {
          audioTopic: "",
          industryNaicsCodeOfAudio: "",
          interactionType: InteractionType.Unspecified,
          languageCodes: ["nb-NO", "", "", ""],
          microphoneDistance: MicrophoneDistance.Unspecified,
          originalMediaType: OriginalMediaType.Unspecified,
          recordingDeviceName: "",
          recordingDeviceType: RecordingDeviceType.Unspecified,
          speechContexts: [{ phrases: [""] }],
        },
      },
    }
  }

  public render() {
    if (this.state.transcript.process === undefined) {
      return (
        <div className="create">
          <h2 className="org-text-xl">Ny transkripsjon</h2>
          <form className="dropForm" onSubmit={this.handleSubmit}>
            <label className="org-label">Lydfil</label>
            <Dropzone
              accept="audio/*"
              style={{
                alignContent: "center",
                borderColor: "rgb(102, 102, 102)",
                borderRadius: "5px",
                borderStyle: "dashed",
                borderWidth: "2px",
                display: "grid",
                height: "100px",
                justifyContent: "center",
                position: "relative",
                width: "100%",
              }}
              onDrop={this.handleFileDrop}
            >
              <div>
                <svg width="20" height="20" focusable="false" aria-hidden="true">
                  <use xlinkHref="#icon-lyd" />
                </svg>
                {this.state.dropzoneMessage}
              </div>
            </Dropzone>

            <label className="org-label">
              Språk
              <select value={this.state.transcript.metadata.languageCodes[0]} onChange={event => this.handleLanguageChange(0, event)}>
                {this.availableLanguages()}
              </select>
              <select data-testid="languages" value={this.state.transcript.metadata.languageCodes[1]} onChange={event => this.handleLanguageChange(1, event)}>
                {this.availableLanguages()}
              </select>
              <select data-testid="languages" value={this.state.transcript.metadata.languageCodes[2]} onChange={event => this.handleLanguageChange(2, event)}>
                {this.availableLanguages()}
              </select>
              <select data-testid="languages" value={this.state.transcript.metadata.languageCodes[3]} onChange={event => this.handleLanguageChange(3, event)}>
                {this.availableLanguages()}
              </select>
            </label>
            <label className="org-label">
              Type
              <select value={this.state.transcript.metadata.interactionType} onChange={this.handleInteractionTypeChange}>
                <option value={InteractionType.Unspecified}>Ukjent eller annen type</option>
                <option value={InteractionType.Discussion}>Diskusjon - Flere personer i samtale eller diskusjon, for eksempel i møte med to eller flere aktive deltakere</option>
                <option value={InteractionType.Presentaton}>Presentasjon - En eller flere personer foreleser eller presenterer til andre, stort sett uten avbrudd</option>
                <option value={InteractionType.PhoneCall}>Telefon- eller videokonferansesamtale - To eller flere personer, som ikke er i samme rom, deltar aktivt i samtale.</option>
                <option value={InteractionType.Voicemail}>Talepostmelding/mobilsvar - Opptak som er ment for en annen person å lytte til.</option>
                <option value={InteractionType.ProfessionallyProduced}>Profesjonelt produsert - Eksempelvis TV-show, podkast</option>
                <option value={InteractionType.Dictation}>Diksjon - Opplesning av dokumenter som tekstmeldinger, e-post eller rapporter.</option>
              </select>
            </label>

            <label className="org-label">
              NAICS-kode
              <small>
                Den 6-sifrede <a href="https://www.naics.com/search/">NAICS-koden</a> som ligger tettest opptil emnene det snakkes om i lydfilen.
              </small>
              <input value={this.state.transcript.metadata.industryNaicsCodeOfAudio} type="text" onChange={this.handleIndustryNaicsCodeOfAudioChange} />
            </label>

            <label className="org-label">
              Mikrofonavstand
              <select value={this.state.transcript.metadata.microphoneDistance} onChange={this.handleMicrophoneDistanceChange}>
                <option value={MicrophoneDistance.Unspecified}>Ukjent</option>
                <option value={MicrophoneDistance.Nearfield}>Mindre enn 1 meter</option>
                <option value={MicrophoneDistance.Midfield}>Mindre enn 3 meter</option>
                <option value={MicrophoneDistance.Farfield}>Mer enn 3 meter</option>
              </select>
            </label>
            <label className="org-label">
              Opprinnelig mediatype
              <select value={this.state.transcript.metadata.originalMediaType} onChange={this.handleOriginalMediaTypeChange}>
                <option value={OriginalMediaType.Unspecified}>Ukjent</option>
                <option value={OriginalMediaType.Audio}>Audio - Lydopptak</option>
                <option value={OriginalMediaType.Video}>Video - Lyden kommer opprinnelig fra et video-opptak </option>
              </select>
            </label>
            <label className="org-label">
              Hvor eller hvordan ble opptaket gjort?
              <select value={this.state.transcript.metadata.recordingDeviceType} onChange={this.handleRecordingDeviceTypeChange}>
                <option value={RecordingDeviceType.Unspecified}>Ukjent</option>
                <option value={RecordingDeviceType.Smartphone}>Smarttelefon - Opptaket ble gjort på en smarttelefon</option>
                <option value={RecordingDeviceType.PC}>PC - Opptaket ble gjort med en PC eller tablet</option>
                <option value={RecordingDeviceType.PhoneLine}>Telefonlinje - Opptaket ble gjort over en telefonlinje</option>
                <option value={RecordingDeviceType.Vehicle}>Kjøretøy - Opptaket ble gjort i et kjøretøy</option>
                <option value={RecordingDeviceType.OtherOutdoorDevice}>Utendørs - Opptaket ble gjort utendørs</option>
                <option value={RecordingDeviceType.OtherIndoorDevice}>Innendørs - Opptaket ble gjort innendørs</option>
              </select>
            </label>

            <label className="org-label">
              Navn på opptaksutstyr
              <small>Eksempel: iPhone X, Polycom SoundStation IP 6000, POTS, VOIP eller Cardioid Microphone</small>
              <input value={this.state.transcript.metadata.recordingDeviceName} type="text" onChange={this.handleRecordingDeviceNameChange} />
            </label>

            <label className="org-label">
              Emne
              <small>Hva handler lydfilen om?</small>
              <textarea value={this.state.transcript.metadata.audioTopic} onChange={this.handleAudioTopicChange} />
            </label>

            <label className="org-label">
              Kontekst
              <small>Gi "hint" til talegjenkjenningen for å favorisere bestemte ord og uttrykk i resultatene, i form av en kommaseparert liste.</small>
              <textarea value={this.state.transcript.metadata.speechContexts[0].phrases} onChange={this.handleSpeechContextChange} />
            </label>

            <button className="org-btn org-btn--primary" disabled={this.formIsDisabled()} type="submit">
              Last opp
            </button>
          </form>
        </div>
      )
    } else {
      const status = this.state.transcript.process.percent < 100 ? "active" : "success"
      return (
        <main id="progress">
          <div className="dropForm">
            <p>Laster opp</p>
            <Progress type="circle" percent={this.state.transcript.process.percent} status={status} />
          </div>
        </main>
      )
    }
  }

  private resetForm() {
    this.setState({
      transcript: {
        metadata: {
          audioTopic: "",
          industryNaicsCodeOfAudio: "",
          interactionType: InteractionType.Unspecified,
          languageCodes: ["nb-NO", "", "", ""],
          microphoneDistance: MicrophoneDistance.Unspecified,
          originalMediaType: OriginalMediaType.Unspecified,
          recordingDeviceName: "",
          recordingDeviceType: RecordingDeviceType.Unspecified,
          speechContexts: [{ phrases: [""] }],
        },
      },
    })
  }

  private handleLanguageChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const transcript = this.state.transcript

    const languageCodes = transcript.metadata.languageCodes
    languageCodes[index] = event.target.value

    transcript.metadata.languageCodes = languageCodes

    this.setState({ transcript })
  }

  private handleInteractionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const transcript = this.state.transcript

    let interactionType = transcript.metadata.interactionType
    interactionType = event.target.value as InteractionType

    transcript.metadata.interactionType = interactionType

    this.setState({ transcript })
  }

  private handleMicrophoneDistanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const transcript = this.state.transcript

    let microphoneDistance = transcript.metadata.microphoneDistance
    microphoneDistance = event.target.value as MicrophoneDistance

    transcript.metadata.microphoneDistance = microphoneDistance

    this.setState({ transcript })
  }

  private handleOriginalMediaTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const transcript = this.state.transcript

    let originalMediaType = transcript.metadata.originalMediaType
    originalMediaType = event.target.value as OriginalMediaType

    transcript.metadata.originalMediaType = originalMediaType

    this.setState({ transcript })
  }

  private handleRecordingDeviceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const transcript = this.state.transcript

    let recordingDeviceType = transcript.metadata.recordingDeviceType
    recordingDeviceType = event.target.value as RecordingDeviceType

    transcript.metadata.recordingDeviceType = recordingDeviceType

    this.setState({ transcript })
  }

  private handleIndustryNaicsCodeOfAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const transcript = this.state.transcript
    transcript.metadata.industryNaicsCodeOfAudio = event.target.value
    this.setState({ transcript })
  }

  private handleRecordingDeviceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const transcript = this.state.transcript
    transcript.metadata.recordingDeviceName = event.target.value
    this.setState({ transcript })
  }

  private handleAudioTopicChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const transcript = this.state.transcript
    transcript.metadata.audioTopic = event.target.value
    this.setState({ transcript })
  }

  private handleSpeechContextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const transcript = this.state.transcript
    transcript.metadata.speechContexts[0].phrases = event.target.value.split(",")
    this.setState({ transcript })
  }

  private handleFileDrop: DropFilesEventHandler = (acceptedFiles: [File], rejectedFiles: [File]) => {
    if (rejectedFiles.length > 0) {
      this.setState({ dropzoneMessage: "Filen har feil format", file: undefined })

      ReactGA.event({
        action: "wrong file format",
        category: "upload",
        label: rejectedFiles[0].type,
      })
    } else {
      // Take the first file
      const [file] = acceptedFiles

      this.setState({ file, dropzoneMessage: file.name })
    }
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { file } = this.state

    const selectedLanguageCodes = this.selectedLanguageCodes()

    if (file === undefined || this.props.user === undefined || this.props.user.uid === undefined || selectedLanguageCodes.length === 0) {
      return
    }
    const userId = this.props.user.uid

    const transcriptId = database.collection("/transcripts").doc().id

    const uploadTask = storage
      .ref(`/media/${userId}`)
      .child(transcriptId)
      .put(file)

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        const transcript = this.state.transcript

        transcript.process = {
          percent: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
          step: Step.Uploading,
        }

        this.setState({ transcript })
      },
      error => {
        ReactGA.exception({
          description: error.message,
          fatal: false,
        })

        /*FIXME https://firebase.google.com/docs/storage/web/handle-errors
        
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break
          case "storage/canceled":
            // User canceled the upload
            break
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            console.error(error)
            console.log("error during upload from error section")
            break
        }*/
      },
      () => {
        const transcript = this.state.transcript
        transcript.name = file.name.substr(0, file.name.lastIndexOf(".")) || file.name
        transcript.createdAt = firebase.firestore.FieldValue.serverTimestamp()
        transcript.userId = userId

        // Metadata

        const metadata: IMetadata = {
          interactionType: transcript.metadata.interactionType,
          languageCodes: this.selectedLanguageCodes(),
          microphoneDistance: transcript.metadata.microphoneDistance,
          originalMediaType: transcript.metadata.originalMediaType,
          originalMimeType: file.type,
          recordingDeviceType: transcript.metadata.recordingDeviceType,
        }

        // Add non empty fields

        if (transcript.metadata.audioTopic !== "") {
          metadata.audioTopic = transcript.metadata.audioTopic
        }

        const industryNaicsCodeOfAudio = parseInt(transcript.metadata.industryNaicsCodeOfAudio, 10)

        if (!isNaN(industryNaicsCodeOfAudio)) {
          transcript.metadata.industryNaicsCodeOfAudio = industryNaicsCodeOfAudio
        }

        if (transcript.metadata.recordingDeviceName !== "") {
          metadata.recordingDeviceName = transcript.metadata.recordingDeviceName
        }

        // Clean up phrases

        const phrases = transcript.metadata.speechContexts[0].phrases
          .filter(phrase => {
            return phrase.trim()
          })
          .map(phrase => phrase.trim())

        if (phrases.length > 0) {
          metadata.speechContexts = [{ phrases }]
        }

        transcript.metadata = metadata

        database
          .doc(`transcripts/${transcriptId}`)
          .set(transcript)
          .then(success => {
            this.resetForm()
          })
          .catch((error: Error) => {
            ReactGA.exception({
              description: error.message,
              fatal: false,
            })
          })
      },
    )
  }

  private selectedLanguageCodes() {
    const languageCodes = this.state.transcript.metadata.languageCodes

    const selectedLanguageCodes = languageCodes.filter(language => {
      return language !== ""
    })

    return selectedLanguageCodes
  }

  private formIsDisabled() {
    return this.selectedLanguageCodes().length === 0 || this.state.file === undefined || this.props.user === undefined
  }

  private availableLanguages() {
    const languages = new Map([
      ["nb-NO", "Norsk"],
      ["sv-SE", "Svensk"],
      ["da-DK", "Dansk"],
      ["en-GB", "Engelsk (Storbritannia)"],
      ["en-US", "Engelsk (USA)"],
      ["", "---"],
      ["af-ZA", "Afrikaans"],
      ["am-ET", "Amharisk"],
      ["ar-DZ", "Arabisk (Algerie)"],
      ["ar-BH", "Arabisk (Bahrain)"],
      ["ar-EG", "Arabisk (Egypt)"],
      ["ar-AE", "Arabisk (De forente arabiske emirater)"],
      ["ar-IQ", "Arabisk (Irak)"],
      ["ar-IL", "Arabisk (Israel)"],
      ["ar-JO", "Arabisk (Jordan)"],
      ["ar-KW", "Arabisk (Kuwait)"],
      ["ar-LB", "Arabisk (Libanon)"],
      ["ar-MA", "Arabisk (Marokko)"],
      ["ar-OM", "Arabisk (Oman)"],
      ["ar-QA", "Arabisk (Qatar)"],
      ["ar-SA", "Arabisk (Saudi-Arabia)"],
      ["ar-PS", "Arabisk (Staten Palestina)"],
      ["ar-TN", "Arabisk (Tunisia)"],
      ["hy-AM", "Armensk"],
      ["az-AZ", "Aserbajdsjansk"],
      ["eu-ES", "Baskisk"],
      ["bn-IN", "Bengalsk (India)"],
      ["bn-BD", "Bengalsk (Bangladesh)"],
      ["bg-BG", "Bulgarsk"],
      ["da-DK", "Dansk"],
      ["en-AU", "Engelsk (Australia)"],
      ["en-CA", "Engelsk (Canada)"],
      ["en-PH", "Engelsk (Filippinene)"],
      ["en-GH", "Engelsk (Ghana)"],
      ["en-IN", "Engelsk (India)"],
      ["en-IE", "Engelsk (Ireland)"],
      ["en-KE", "Engelsk (Kenya)"],
      ["en-NZ", "Engelsk (New Zealand)"],
      ["en-NG", "Engelsk (Nigeria)"],
      ["en-GB", "Engelsk (Storbritannia)"],
      ["en-ZA", "Engelsk (Sør-Afrika)"],
      ["en-TZ", "Engelsk (Tanzania)"],
      ["en-US", "Engelsk (USA)"],
      ["fil-PH", "Filippinsk"],
      ["fi-FI", "Finsk"],
      ["fr-CA", "Fransk (Canada)"],
      ["fr-FR", "Fransk (Frankrike)"],
      ["gl-ES", "Galicisk"],
      ["ka-GE", "Georgisk"],
      ["el-GR", "Gresk"],
      ["gu-IN", "Gujarati"],
      ["he-IL", "Hebraisk"],
      ["hi-IN", "Hindi"],
      ["id-ID", "Indonesisk"],
      ["is-IS", "Islandsk"],
      ["it-IT", "Italiensk"],
      ["ja-JP", "Japansk"],
      ["jv-ID", "Javanesisk"],
      ["kn-IN", "Kannada"],
      ["ca-ES", "Katalansk"],
      ["km-KH", "Khmer"],
      ["yue-Hant-HK", "Kinesisk, kantonesisk (tradisjonell, Hong Kong)"],
      ["cmn-Hans-HK", "Kinesisk, mandarin (forenklet, Hong Kong)"],
      ["cmn-Hans-CN", "Kinesisk, mandarin (forenklet, Kina)"],
      ["cmn-Hant-TW", "Kinesisk, mandarin (tradisjonell, Taiwan)"],
      ["ko-KR", "Koreansk"],
      ["hr-HR", "Kroatisk"],
      ["lo-LA", "Lao"],
      ["lv-LV", "Latvisk"],
      ["lt-LT", "Litauisk"],
      ["ms-MY", "Malay"],
      ["ml-IN", "Malayalam"],
      ["mr-IN", "Marathi"],
      ["nl-NL", "Nederlandsk"],
      ["ne-NP", "Nepalsk"],
      ["nb-NO", "Norsk"],
      ["fa-IR", "Persisk"],
      ["pl-PL", "Polsk"],
      ["pt-BR", "Portugisisk (Brasil)"],
      ["pt-PT", "Portugisisk (Portugal)"],
      ["ro-RO", "Rumensk"],
      ["ru-RU", "Russisk"],
      ["sr-RS", "Serbisk"],
      ["si-LK", "Sinhala"],
      ["sk-SK", "Slovakisk"],
      ["sl-SI", "Slovensk"],
      ["es-AR", "Spansk (Argentina)"],
      ["es-BO", "Spansk (Bolivia)"],
      ["es-CL", "Spansk (Chile)"],
      ["es-CO", "Spansk (Colombia)"],
      ["es-CR", "Spansk (Costa Rica)"],
      ["es-DO", "Spansk (Den dominikanske republikk)"],
      ["es-EC", "Spansk (Ecuador)"],
      ["es-SV", "Spansk (El Salvador)"],
      ["es-GT", "Spansk (Guatemala)"],
      ["es-HN", "Spansk (Honduras)"],
      ["es-MX", "Spansk (Mexico)"],
      ["es-NI", "Spansk (Nicaragua)"],
      ["es-PA", "Spansk (Panama)"],
      ["es-PY", "Spansk (Paraguay)"],
      ["es-PE", "Spansk (Peru)"],
      ["es-PR", "Spansk (Puerto Rico)"],
      ["es-ES", "Spansk (Spania)"],
      ["es-UY", "Spansk (Uruguay)"],
      ["es-US", "Spansk (USA)"],
      ["es-VE", "Spansk (Venezuela)"],
      ["su-ID", "Sundanesisk"],
      ["sv-SE", "Svensk"],
      ["sw-KE", "Swahili (Kenya)"],
      ["sw-TZ", "Swahili (Tanzania)"],
      ["ta-IN", "Tamil (India)"],
      ["ta-MY", "Tamil (Malaysia)"],
      ["ta-SG", "Tamil (Singapore)"],
      ["ta-LK", "Tamil (Sri Lanka)"],
      ["te-IN", "Telugu"],
      ["th-TH", "Thai"],
      ["cs-CZ", "Tsjekkia"],
      ["tr-TR", "Tyrkisk"],
      ["de-DE", "Tysk"],
      ["uk-UA", "Ukrainsk"],
      ["hu-HU", "Ungarsk"],
      ["ur-IN", "Urdu (India)"],
      ["ur-PK", "Urdu (Pakistan)"],
      ["vi-VN", "Vietnamesisk"],
      ["zu-ZA", "Zulu"],
    ])

    return Array.from(languages).map(([key, value]) => (
      <option key={key} value={key}>
        {value}
      </option>
    ))
  }
}

export default Upload
