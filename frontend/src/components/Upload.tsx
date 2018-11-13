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
                  display: "grid",
                  justifyContent: "center",
                  alignContent: "center",
                  position: "relative",
                  width: "100%",
                  height: "100px",
                  borderWidth: "2px",
                  borderColor: "rgb(102, 102, 102)",
                  borderStyle: "dashed",
                  borderRadius: "5px",
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
                <option value="nb-NO">Norsk</option>
                <option value="en-US">Engelsk</option>
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
