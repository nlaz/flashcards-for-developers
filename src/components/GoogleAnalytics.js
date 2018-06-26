import { Component } from "react";
import ReactGA from "react-ga";
import config from "../config";

ReactGA.initialize(config.googleAnalyticsKey);

export function logSignupEvent(userId) {
  ReactGA.event({
    category: "User",
    action: "created",
  });
}

class GoogleAnalytics extends Component {
  render() {
    console.log("ga key", config.googleAnalyticsKey);
    ReactGA.set({ page: window.location.pathname + window.location.search });
    ReactGA.pageview(window.location.pathname + window.location.search);
    return null;
  }
}

export default GoogleAnalytics;
