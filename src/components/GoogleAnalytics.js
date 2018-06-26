import { Component } from "react";
import ReactGA from "react-ga";
import config from "../config";

ReactGA.initialize(config.googleAnalyticsKey);

class GoogleAnalytics extends Component {
  render() {
    ReactGA.set({ page: window.location.pathname + window.location.hash });
    ReactGA.pageview(window.location.pathname + window.location.hash);
    return null;
  }
}

export default GoogleAnalytics;
