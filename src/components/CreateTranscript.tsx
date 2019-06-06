import firebase from "firebase/app"
import * as React from "react"
import ReactGA from "react-ga"
import { InteractionType, MicrophoneDistance, OriginalMediaType, ProgressType, RecordingDeviceType } from "../enums"
import { database, storage } from "../firebaseApp"
import { IMetadata, ITranscript } from "../interfaces"

interface IProps {
  transcriptCreated: (transcriptId: string) => void
}

interface IState {
  fileUploaded: boolean
  transcriptId?: string
  audioTopic: string
  industryNaicsCodeOfAudio: string
  interactionType: InteractionType
  isSubmitting: boolean
  languageCodes: ReadonlyArray<string>
  microphoneDistance: MicrophoneDistance
  originalMediaType: OriginalMediaType
  recordingDeviceName: string
  recordingDeviceType: RecordingDeviceType
  speechContextsPhrases: string
  submitButtonPressed: boolean
  percent?: number
}

interface IProps {
  file: File
  userId: string
}

class CreateTranscript extends React.Component<IProps, IState> {
  public state: Readonly<IState> = {
    audioTopic: "",
    fileUploaded: false,
    industryNaicsCodeOfAudio: "",
    interactionType: InteractionType.Unspecified,
    isSubmitting: false,
    languageCodes: ["nb-NO", "", "", ""],
    microphoneDistance: MicrophoneDistance.Unspecified,
    originalMediaType: OriginalMediaType.Unspecified,
    recordingDeviceName: "",
    recordingDeviceType: RecordingDeviceType.Unspecified,
    speechContextsPhrases: "",
    submitButtonPressed: false,
  }

  public componentDidMount() {
    this.uploadFile()
  }

  public componentDidUpdate() {
    if (this.state.submitButtonPressed === true && this.state.isSubmitting === false && this.state.fileUploaded === true && this.state.transcriptId !== undefined) {
      this.submit()
    }
  }

  public render() {
    return (
      <main id="transcript">
        <div className="create">
          <h2 className="org-text-xl">{this.props.file.name}</h2>
          <form className="dropForm" onSubmit={this.handleSubmit}>
            <fieldset disabled={this.state.submitButtonPressed === true}>
              <label className="org-label">
                Språk
                <select value={this.state.languageCodes[0]} onChange={event => this.handleLanguageChange(0, event)}>
                  {this.availableLanguages()}
                </select>
                <select data-testid="languages" value={this.state.languageCodes[1]} onChange={event => this.handleLanguageChange(1, event)}>
                  {this.availableLanguages()}
                </select>
                <select data-testid="languages" value={this.state.languageCodes[2]} onChange={event => this.handleLanguageChange(2, event)}>
                  {this.availableLanguages()}
                </select>
                <select data-testid="languages" value={this.state.languageCodes[3]} onChange={event => this.handleLanguageChange(3, event)}>
                  {this.availableLanguages()}
                </select>
              </label>
              <label className="org-label">
                Type
                <select value={this.state.interactionType} onChange={this.handleInteractionTypeChange}>
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
                <input value={this.state.industryNaicsCodeOfAudio} type="text" onChange={this.handleIndustryNaicsCodeOfAudioChange} />
              </label>

              <label className="org-label">
                Mikrofonavstand
                <select value={this.state.microphoneDistance} onChange={this.handleMicrophoneDistanceChange}>
                  <option value={MicrophoneDistance.Unspecified}>Ukjent</option>
                  <option value={MicrophoneDistance.Nearfield}>Mindre enn 1 meter</option>
                  <option value={MicrophoneDistance.Midfield}>Mindre enn 3 meter</option>
                  <option value={MicrophoneDistance.Farfield}>Mer enn 3 meter</option>
                </select>
              </label>
              <label className="org-label">
                Opprinnelig mediatype
                <select value={this.state.originalMediaType} onChange={this.handleOriginalMediaTypeChange}>
                  <option value={OriginalMediaType.Unspecified}>Ukjent</option>
                  <option value={OriginalMediaType.Audio}>Audio - Lydopptak</option>
                  <option value={OriginalMediaType.Video}>Video - Lyden kommer opprinnelig fra et video-opptak </option>
                </select>
              </label>
              <label className="org-label">
                Hvor eller hvordan ble opptaket gjort?
                <select value={this.state.recordingDeviceType} onChange={this.handleRecordingDeviceTypeChange}>
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
                <input value={this.state.recordingDeviceName} type="text" onChange={this.handleRecordingDeviceNameChange} />
              </label>

              <label className="org-label">
                Emne
                <small>Hva handler lydfilen om?</small>
                <textarea value={this.state.audioTopic} onChange={this.handleAudioTopicChange} />
              </label>

              <label className="org-label">
                Kontekst
                <small>Gi "hint" til talegjenkjenningen for å favorisere bestemte ord og uttrykk i resultatene, i form av en kommaseparert liste.</small>
                <textarea value={this.state.speechContextsPhrases} onChange={this.handleSpeechContextChange} />
              </label>

              <button className="org-btn org-btn--primary" disabled={this.submitButtonIsDisabled()} type="submit">
                {(() => {
                  if (this.state.submitButtonPressed === true && this.state.fileUploaded === false && this.state.percent !== undefined) {
                    return `Laster opp ${this.state.percent}%`
                  } else {
                    return "Last opp"
                  }
                })()}
              </button>
            </fieldset>
          </form>
        </div>
      </main>
    )
  }

  private async submit() {
    this.setState({ isSubmitting: true })

    const file = this.props.file

    const fileNameAndExtension = [file.name.substr(0, file.name.lastIndexOf(".")), file.name.substr(file.name.lastIndexOf(".") + 1, file.name.length)]

    let name = ""
    let fileExtension = ""
    if (fileNameAndExtension.length === 2) {
      name = fileNameAndExtension[0]
      fileExtension = fileNameAndExtension[1]
    }

    // Metadata

    const metadata: IMetadata = {
      fileExtension,
      interactionType: this.state.interactionType,
      languageCodes: this.selectedLanguageCodes(),
      microphoneDistance: this.state.microphoneDistance,
      originalMediaType: this.state.originalMediaType,
      originalMimeType: file.type,
      recordingDeviceType: this.state.recordingDeviceType,
    }

    // Add non empty fields

    if (this.state.audioTopic !== "") {
      metadata.audioTopic = this.state.audioTopic
    }

    const industryNaicsCodeOfAudio = parseInt(this.state.industryNaicsCodeOfAudio, 10)

    if (!isNaN(industryNaicsCodeOfAudio)) {
      metadata.industryNaicsCodeOfAudio = industryNaicsCodeOfAudio
    }

    if (this.state.recordingDeviceName !== "") {
      metadata.recordingDeviceName = this.state.recordingDeviceName
    }

    // Clean up phrases

    const phrases = this.state.speechContextsPhrases
      .split(",")
      .filter(phrase => {
        return phrase.trim()
      })
      .map(phrase => phrase.trim())

    if (phrases.length > 0) {
      metadata.speechContexts = [{ phrases }]
    }

    const transcriptId = this.state.transcriptId

    const transcript: ITranscript = {
      id: transcriptId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      metadata,
      name,
      status: {
        percent: this.state.percent,
        progress: ProgressType.Uploading,
      },
      userId: this.props.userId,
    }

    try {
      await database.doc(`transcripts/${transcriptId}`).set(transcript)

      this.props.transcriptCreated(transcriptId)
    } catch (error) {
      console.error(error)
      ReactGA.exception({
        description: error.message,
        fatal: false,
      })
    }
  }

  private uploadFile() {
    // Immediately start uploading the file

    const transcriptId = database.collection("/transcripts").doc().id

    const uploadTask = storage
      .ref(`/media/${this.props.userId}`)
      .child(`${transcriptId}-original`)
      .put(this.props.file)

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        this.setState({
          percent: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        })
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
        this.setState({ fileUploaded: true, transcriptId })
      },
    )
  }

  private handleLanguageChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const languageCodes = [...this.state.languageCodes]
    languageCodes[index] = event.target.value

    this.setState({ languageCodes })
  }

  private handleInteractionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ interactionType: event.target.value as InteractionType })
  }

  private handleMicrophoneDistanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ microphoneDistance: event.target.value as MicrophoneDistance })
  }

  private handleOriginalMediaTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ originalMediaType: event.target.value as OriginalMediaType })
  }

  private handleRecordingDeviceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ recordingDeviceType: event.target.value as RecordingDeviceType })
  }

  private handleIndustryNaicsCodeOfAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ industryNaicsCodeOfAudio: event.target.value })
  }

  private handleRecordingDeviceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ recordingDeviceName: event.target.value })
  }

  private handleAudioTopicChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ audioTopic: event.target.value })
  }

  private handleSpeechContextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ speechContextsPhrases: event.target.value })
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const selectedLanguageCodes = this.selectedLanguageCodes()

    if (selectedLanguageCodes.length === 0) {
      return
    }

    this.setState({ submitButtonPressed: true })
  }

  private selectedLanguageCodes() {
    const languageCodes = this.state.languageCodes

    // This will remove unselected languages (no value) and remove duplicates
    const selectedLanguageCodes = languageCodes.filter((language, index, array) => {
      return language !== "" && array.indexOf(language) === index
    })

    return selectedLanguageCodes
  }

  private submitButtonIsDisabled() {
    return this.selectedLanguageCodes().length === 0
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

export default CreateTranscript
