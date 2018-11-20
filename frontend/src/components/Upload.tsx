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
  languageCode: string
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
      languageCode: "nb-NO",
      uploadProgress: 0,
    }
  }

  public handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ languageCode: event.target.value })
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

    const { file, languageCode } = this.state

    if (file === undefined || this.props.user === undefined) {
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
            languageCode,
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
                languageCode: "nb-NO",
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
              <select data-testid="languages" value={this.state.languageCode} onChange={this.handleLanguageChange}>
                <option value="af-ZA">Afrikaans</option>
                <option value="am-ET">Amharisk</option>
                <option value="ar-DZ">Arabisk (Algerie)</option>
                <option value="ar-BH">Arabisk (Bahrain)</option>
                <option value="ar-EG">Arabisk (Egypt)</option>
                <option value="ar-AE">Arabisk (De forente arabiske emirater)</option>
                <option value="ar-IQ">Arabisk (Irak)</option>
                <option value="ar-IL">Arabisk (Israel)</option>
                <option value="ar-JO">Arabisk (Jordan)</option>
                <option value="ar-KW">Arabisk (Kuwait)</option>
                <option value="ar-LB">Arabisk (Libanon)</option>
                <option value="ar-MA">Arabisk (Marokko)</option>
                <option value="ar-OM">Arabisk (Oman)</option>
                <option value="ar-QA">Arabisk (Qatar)</option>
                <option value="ar-SA">Arabisk (Saudi-Arabia)</option>
                <option value="ar-PS">Arabisk (Staten Palestina)</option>
                <option value="ar-TN">Arabisk (Tunisia)</option>
                <option value="hy-AM">Armensk</option>
                <option value="az-AZ">Aserbajdsjansk</option>
                <option value="eu-ES">Baskisk</option>
                <option value="bn-IN">Bengalsk (India)</option>
                <option value="bn-BD">Bengalsk (Bangladesh)</option>
                <option value="bg-BG">Bulgarsk</option>
                <option value="da-DK">Dansk</option>
                <option value="en-AU">Engelsk (Australia)</option>
                <option value="en-CA">Engelsk (Canada)</option>
                <option value="en-PH">Engelsk (Filippinene)</option>
                <option value="en-GH">Engelsk (Ghana)</option>
                <option value="en-IN">Engelsk (India)</option>
                <option value="en-IE">Engelsk (Ireland)</option>
                <option value="en-KE">Engelsk (Kenya)</option>
                <option value="en-NZ">Engelsk (New Zealand)</option>
                <option value="en-NG">Engelsk (Nigeria)</option>
                <option value="en-GB">Engelsk (Storbritannia)</option>
                <option value="en-ZA">Engelsk (Sør-Afrika)</option>
                <option value="en-TZ">Engelsk (Tanzania)</option>
                <option value="en-US">Engelsk (USA)</option>
                <option value="fil-PH">Filippinsk</option>
                <option value="fi-FI">Finsk</option>
                <option value="fr-CA">Fransk (Canada)</option>
                <option value="fr-FR">Fransk (Frankrike)</option>
                <option value="gl-ES">Galicisk</option>
                <option value="ka-GE">Georgisk</option>
                <option value="el-GR">Gresk</option>
                <option value="gu-IN">Gujarati</option>
                <option value="he-IL">Hebraisk</option>
                <option value="hi-IN">Hindi</option>
                <option value="id-ID">Indonesisk</option>
                <option value="is-IS">Islandsk</option>
                <option value="it-IT">Italiensk</option>
                <option value="ja-JP">Japansk</option>
                <option value="jv-ID">Javanesisk</option>
                <option value="kn-IN">Kannada</option>
                <option value="ca-ES">Katalansk</option>
                <option value="km-KH">Khmer</option>
                <option value="yue-Hant-HK">Kinesisk, kantonesisk (tradisjonell, Hong Kong)</option>
                <option value="cmn-Hans-HK">Kinesisk, mandarin (forenklet, Hong Kong)</option>
                <option value="cmn-Hans-CN">Kinesisk, mandarin (forenklet, Kina)</option>
                <option value="cmn-Hant-TW">Kinesisk, mandarin (tradisjonell, Taiwan)</option>
                <option value="ko-KR">Koreansk</option>
                <option value="hr-HR">Kroatisk</option>
                <option value="lo-LA">Lao</option>
                <option value="lv-LV">Latvisk</option>
                <option value="lt-LT">Litauisk</option>
                <option value="ms-MY">Malay</option>
                <option value="ml-IN">Malayalam</option>
                <option value="mr-IN">Marathi</option>
                <option value="nl-NL">Nederlandsk</option>
                <option value="ne-NP">Nepalsk</option>
                <option value="nb-NO">Norsk</option>
                <option value="fa-IR">Persisk</option>
                <option value="pl-PL">Polsk</option>
                <option value="pt-BR">Portugisisk (Brasil)</option>
                <option value="pt-PT">Portugisisk (Portugal)</option>
                <option value="ro-RO">Rumensk</option>
                <option value="ru-RU">Russisk</option>
                <option value="sr-RS">Serbisk</option>
                <option value="si-LK">Sinhala</option>
                <option value="sk-SK">Slovakisk</option>
                <option value="sl-SI">Slovensk</option>
                <option value="es-AR">Spansk (Argentina)</option>
                <option value="es-BO">Spansk (Bolivia)</option>
                <option value="es-CL">Spansk (Chile)</option>
                <option value="es-CO">Spansk (Colombia)</option>
                <option value="es-CR">Spansk (Costa Rica)</option>
                <option value="es-DO">Spansk (Den dominikanske republikk)</option>
                <option value="es-EC">Spansk (Ecuador)</option>
                <option value="es-SV">Spansk (El Salvador)</option>
                <option value="es-GT">Spansk (Guatemala)</option>
                <option value="es-HN">Spansk (Honduras)</option>
                <option value="es-MX">Spansk (Mexico)</option>
                <option value="es-NI">Spansk (Nicaragua)</option>
                <option value="es-PA">Spansk (Panama)</option>
                <option value="es-PY">Spansk (Paraguay)</option>
                <option value="es-PE">Spansk (Peru)</option>
                <option value="es-PR">Spansk (Puerto Rico)</option>
                <option value="es-ES">Spansk (Spania)</option>
                <option value="es-UY">Spansk (Uruguay)</option>
                <option value="es-US">Spansk (USA)</option>
                <option value="es-VE">Spansk (Venezuela)</option>
                <option value="su-ID">Sundanesisk</option>
                <option value="sv-SE">Svensk</option>
                <option value="sw-KE">Swahili (Kenya)</option>
                <option value="sw-TZ">Swahili (Tanzania)</option>
                <option value="ta-IN">Tamil (India)</option>
                <option value="ta-MY">Tamil (Malaysia)</option>
                <option value="ta-SG">Tamil (Singapore)</option>
                <option value="ta-LK">Tamil (Sri Lanka)</option>
                <option value="te-IN">Telugu</option>
                <option value="th-TH">Thai</option>
                <option value="cs-CZ">Tsjekkia</option>
                <option value="tr-TR">Tyrkisk</option>
                <option value="de-DE">Tysk</option>
                <option value="uk-UA">Ukrainsk</option>
                <option value="hu-HU">Ungarsk</option>
                <option value="ur-IN">Urdu (India)</option>
                <option value="ur-PK">Urdu (Pakistan)</option>
                <option value="vi-VN">Vietnamesisk</option>
                <option value="zu-ZA">Zulu</option>
              </select>
            </label>
            <button className="org-btn org-btn--primary" disabled={this.state.file === undefined || this.props.user === undefined} type="submit">
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
}

export default Upload
