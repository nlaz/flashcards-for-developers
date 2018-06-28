import { Component } from "react";
import ReactGA from "react-ga";
import config from "../config";

ReactGA.initialize(config.googleAnalyticsKey);

export function logReviewEvent(cardId) {
  ReactGA.event({
    category: "User",
    action: "Reviewed a card",
    value: cardId,
  });
}

export function logFinishedEvent(deckId) {
  ReactGA.event({
    category: "User",
    action: "Finished reviewing a deck",
    value: deckId,
  });
}

export function logReviewAgainEvent(deckId) {
  ReactGA.event({
    category: "User",
    action: "Clicked review again",
    value: deckId,
  });
}

class GoogleAnalytics extends Component {
  render() {
    ReactGA.set({ page: window.location.pathname + window.location.hash });
    ReactGA.pageview(window.location.pathname + window.location.hash);
    return null;
  }
}

export default GoogleAnalytics;
