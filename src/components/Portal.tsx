import * as React from "react"
import ReactDOM from "react-dom"

interface IProps {
  children: React.ReactChildren;
}

class Portal extends React.Component<IProps, any> {
  public portalRoot: HTMLElement;
  public el: HTMLDivElement;

  constructor(props: IProps) {
    super(props)
    this.portalRoot = document.getElementById("portal")
    this.el = document.createElement("div")
  }

  public componentDidMount() {
    this.portalRoot.appendChild(this.el)
  }

  public componentWillUnmount() {
    this.portalRoot.removeChild(this.el)
  }

  public render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}

export default Portal
