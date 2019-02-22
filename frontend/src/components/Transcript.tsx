import * as React from "react"
import ReactGA from "react-ga"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router"
import { ActionCreators } from "redux-undo"
import { Step, SweetProgressStatus } from "../enums"
import { functions } from "../firebaseApp"
import { ITranscript } from "../interfaces"
import Process from "./Process"
import TranscriptionProgress from "./TranscriptionProgress"
import TranscriptResults from "./TranscriptResults"

interface IProps {
  history: History
  transcript: ITranscript | null
  transcriptId?: string
}

interface IReduxStateToProps {
  transcript: {
    present: ITranscript
  }
}

interface IReduxDispatchToProps {
  clearHistory: () => void
}

class Transcript extends React.Component<RouteComponentProps<{}> & IReduxStateToProps & IReduxDispatchToProps> {
  public componentDidUpdate(prevProps: IReduxStateToProps & IReduxDispatchToProps) {
    // When the results are loaded the first, we reset the undo history
    // This is to stop users from undoing back to a state before the results were loaded

    if (prevProps.transcript.present.results === undefined && this.props.transcript.present.results !== undefined) {
      this.props.clearHistory()
    }
  }

  public render() {
    const transcript = this.props.transcript.present

    // Loading from Firebase
    if (transcript === null) {
      return "Loading"
    }
    // Transcription not found
    else if (transcript === undefined) {
      ReactGA.event({
        action: "not found",
        category: "transcript",
        label: this.props.transcriptId,
      })
      return (
        <main id="loading">
          <TranscriptionProgress message={"Fant ikke transkripsjonen"} status={SweetProgressStatus.Error} />
        </main>
      )
    } else {
      // Check current step

      const isDone = transcript && transcript.process && transcript.process.step === Step.Done ? true : false

      return (
        <main id="transcript">
          <section className="org-bar">
            <span className="org-text-l">{transcript.name}</span>

            {(() => {
              if (isDone) {
                return (
                  <>
                    {(() => {
                      if (this.props.transcript.present.results && this.props.transcript.past.length > 0) {
                        return (
                          <>
                            <button className="org-btn">
                              <svg width="20" height="20" focusable="false" aria-hidden="true">
                                <use xlinkHref="#icon-undo" />
                              </svg>{" "}
                              Angre (⌘Z)
                            </button>
                          </>
                        )
                      } else {
                        return (
                          <>
                            <button className="org-btn" onClick={() => this.handleExportTranscriptButtonClicked("docx")}>
                              <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                <g fill="none" fillRule="evenodd">
                                  <path d="M17 0H3a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3z" fill="#252627" />
                                  <text fontFamily="Roboto-Medium, Roboto" fontSize="15" fontWeight="400" fill="#FFF" transform="translate(0 -2)">
                                    <tspan x="4.4" y="16">
                                      w
                                    </tspan>
                                  </text>
                                </g>
                              </svg>{" "}
                              docx
                            </button>

                            <button className="org-btn" onClick={() => this.handleExportTranscriptButtonClicked("xmp")}>
                              <svg width="20" height="20" focusable="false" aria-hidden="true">
                                <use xlinkHref="#icon-premiere" />
                              </svg>{" "}
                              xmp
                            </button>
                          </>
                        )
                      }
                    })()}

                    <button className="org-btn" onClick={this.handleDeleteButtonClicked}>
                      <svg width="20" height="20" focusable="false" aria-hidden="true">
                        <use xlinkHref="#icon-garbage" />
                      </svg>{" "}
                      Slett
                    </button>
                  </>
                )
              } else {
                return "Loading transcript"
              }
            })()}
          </section>

          {(() => {
            if (isDone) {
              return (
                <div className="results">
                  <TranscriptResults />
                </div>
              )
            } else {
              return <Process transcript={transcript} />
            }
          })()}
        </main>
      )
    }
  }

  private handleExportTranscriptButtonClicked = (type: string) => {
    ReactGA.event({
      action: "export button pressed",
      category: "transcript",
      label: type,
    })

    const id = this.props.transcriptId

    window.location.href = `${process.env.REACT_APP_FIREBASE_HTTP_CLOUD_FUNCTION_URL}/exportTranscript?id=${id}&type=${type}`
  }

  private handleDeleteButtonClicked = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ReactGA.event({
      action: "delete button pressed",
      category: "transcript",
    })

    const transcriptId = this.props.transcriptId
    const deleteTranscript = functions.httpsCallable("deleteTranscript")

    try {
      this.props.history.push("/transcripts/")
      await deleteTranscript({ transcriptId })
    } catch (error) {
      console.error(error)
      ReactGA.exception({
        description: error.message,
        fatal: false,
      })
    }
  }
}

const mapStateToProps = (state: State): IReduxStateToProps => {
  return {
    transcript: state.transcript,
  }
}

const mapDispatchToProps = (dispatch: Dispatch): IReduxDispatchToProps => {
  return {
    clearHistory: () => dispatch(ActionCreators.clearHistory()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Transcript)
