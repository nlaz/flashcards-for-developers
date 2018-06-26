import { Component } from "react";
import ReactGA from "react-ga";
import config from "../config";

class GoogleAnalytics extends Component {
  componentWillMount() {
    ReactGA.initialize(config.googleAnalyticsKey);
  }

  render() {
    ReactGA.set({ page: window.location.pathname + window.location.hash });
    ReactGA.pageview(window.location.pathname + window.location.hash);
    return null;
  }
}

export default GoogleAnalytics;
