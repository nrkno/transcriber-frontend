import React, { Component } from "react"
import Dropzone, { DropFilesEventHandler } from "react-dropzone"
import ReactGA from "react-ga"

const VALID_MIME_TYPES_RE = /audio\/|video\/|application\/mxf/

interface IProps {
  fileSelected: (file: File) => void
  showFileTypeErrorMessage: () => void
}

class UploadButton extends Component<IProps, any> {
  public render() {
    const style = { alignContent: "center", borderColor: "rgb(102, 102, 102)", borderRadius: "5px", borderStyle: "dashed", borderWidth: "2px", display: "grid", height: "100px", justifyContent: "center", position: "relative", width: "100%" }

    return (
      <Dropzone onDrop={this.handleFileDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div {...getRootProps()} style={style}>
              <input {...getInputProps()} />
              <button id="new-trans" className="org-btn org-btn--primary org-btn--round">
                <svg width="40" height="40" aria-hidden="true">
                  <use xlinkHref="#icon-pluss" />
                </svg>
              </button>
            </div>
          )
        }}
      </Dropzone>
    )
  }
  private handleFileDrop: DropFilesEventHandler = (accepted: File[], rejected: File[], event: React.DragEvent<HTMLElement>) => {
    if (rejected.length > 0) {
      console.error(rejected)

      ReactGA.event({
        action: "upload failed",
        category: "transcript",
        label: rejected[0].type,
      })
    } else {
      const filesAreValid = accepted.every(file => VALID_MIME_TYPES_RE.test(file.type))
      if (filesAreValid) {
        const [firstFile] = accepted;
        this.props.fileSelected(firstFile)
      } else {
        this.props.showFileTypeErrorMessage()
      }
    }
  }
}

export default UploadButton
