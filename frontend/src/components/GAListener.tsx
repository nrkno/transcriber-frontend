import PropTypes from "prop-types"
import * as React from "react"
import ReactGA from "react-ga"

export default class GAListener extends React.Component {
  public static contextTypes = {
    router: PropTypes.object,
  }

  public componentDidMount() {
    this.sendPageView(this.context.router.history.location)
    this.context.router.history.listen(this.sendPageView)
  }

  public sendPageView(location: Location) {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
  }

  public render() {
    return this.props.children
  }
}
