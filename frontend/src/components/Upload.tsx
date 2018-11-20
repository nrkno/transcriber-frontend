import firebase from "firebase/app"
import * as React from "react"
// import Dropzone from "react-dropzone"
// Testing not working with normal import right now, see https://github.com/react-dropzone/react-dropzone/issues/554
let Dropzone = require("react-dropzone")
if ("default" in Dropzone) {
  Dropzone = Dropzone.default
}
import ReactGA from "react-ga"
import { Progress } from "react-sweet-progress"
import "react-sweet-progress/lib/style.css"
import { Status } from "../enums"
import { database, storage } from "../firebaseApp"
import { ITranscript } from "../interfaces"

interface IState {
  file?: File
  dropzoneMessage?: string
  languageCodes: string[]
  uploadProgress: number
}

interface IProps {
  user?: firebase.User
}

class Upload extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)

    this.state = {
      file: undefined,
      languageCodes: ["nb-NO", "", "", ""],
      uploadProgress: 0,
    }
  }

  public handleLanguageChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const languageCodes = this.state.languageCodes
    languageCodes[index] = event.target.value
    this.setState({ languageCodes })

    console.log(languageCodes)
  }
  public handleFileDrop = (acceptedFiles: [File], rejectedFiles: [File]) => {
    if (rejectedFiles.length > 0) {
      this.setState({ dropzoneMessage: "Filen har feil format", file: undefined })

      ReactGA.event({
        action: "Wrong file format",
        category: "Upload",
      })
    } else {
      // Take the first file
      const [file] = acceptedFiles

      this.setState({ file, dropzoneMessage: file.name })
    }
  }

  public handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { file } = this.state

    const selectedLanguageCodes = this.selectedLanguageCodes()

    if (file === undefined || this.props.user === undefined || selectedLanguageCodes.length === 0) {
      return
    }

    const transcriptRef = database.collection("/users").doc()

    const id = transcriptRef.id

    const metadata = {
      contentType: file.type,
    }

    const uploadTask = storage
      .ref()
      .child(id)
      .put(file, metadata)

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        const uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        this.setState({ uploadProgress })
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
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          const title = file.name.substr(0, file.name.lastIndexOf(".")) || file.name

          const transcript: ITranscript = {
            audio: {
              type: file.type,
              url: downloadURL,
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            languageCodes: this.selectedLanguageCodes(),
            ownedBy: this.props.user.uid,
            progress: { status: Status.Analysing },
            timestamps: {
              analysing: firebase.firestore.FieldValue.serverTimestamp(),
            },
            title,
          }

          database
            .doc(`transcripts/${id}`)
            .set(transcript)
            .then(success => {
              // Reset state
              this.setState({
                dropzoneMessage: undefined,
                file: undefined,
                languageCodes: ["nb-NO", "", "", ""],
                uploadProgress: 0,
              })
            })
            .catch((error: Error) => {
              ReactGA.exception({
                description: error.message,
                fatal: false,
              })
            })
        })
      },
    )
  }

  public render() {
    if (this.state.uploadProgress === 0 || this.state.uploadProgress === 100) {
      return (
        <div className="create">
          <h2 className="org-text-xl">Ny transkripsjon</h2>
          <form className="dropForm" onSubmit={this.handleSubmit}>
            <label className="org-label">
              Lydfil
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
            </label>
            <label className="org-label">
              Språk
              <small>
                Velg opptil 4 språk{" "}
                <svg width="15" height="15" aria-hidden="true">
                  <use xlinkHref="#icon-speak" />
                </svg>
              </small>
              <select data-testid="languages" value={this.state.languageCodes[0]} onChange={event => this.handleLanguageChange(0, event)}>
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
            <button className="org-btn org-btn--primary" disabled={this.formIsDisabled()} type="submit">
              Last opp
            </button>
          </form>
        </div>
      )
    } else {
      const status = this.state.uploadProgress < 100 ? "active" : "success"
      return (
        <main id="progress">
          <div className="dropForm">
            <p>Laster opp</p>
            <Progress type="circle" percent={this.state.uploadProgress} status={status} />
          </div>
        </main>
      )
    }
  }

  private selectedLanguageCodes() {
    const languageCodes = this.state.languageCodes

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
      ["", "Velg språk.."],
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
