import * as React from "react"

import Portal from "./Portal"

interface IProps {
  hideErrorMessage: () => void
}

class FileTypeErrorModalWindow extends React.Component<IProps, any> {
  public preventScreenScrolling = (e: Event) => {
    e.preventDefault()
  }

  public componentDidMount() {
    document.body.addEventListener("scroll", this.preventScreenScrolling)
  }

  public componentWillUnmount() {
    document.body.removeEventListener('scroll', this.preventScreenScrolling)
  }

  public render() {
    const { hideErrorMessage } = this.props

    return (
      <Portal>
        <div className="modal_overlay">
          <div className="modal_container">
            <div className="modal_header">En feil har oppstått</div>
            <div className="modal_content">Filtypen støttes ikke</div>
            <div className="modal_action-footer">
              <button onClick={hideErrorMessage} className="org-btn org-btn--primary">
                Ok
              </button>
            </div>
          </div>
        </div>
      </Portal>
    )
  }
}

export default FileTypeErrorModalWindow
