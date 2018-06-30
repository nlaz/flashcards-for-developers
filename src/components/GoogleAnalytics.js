import { Component } from "react";
import ReactGA from "react-ga";
import config from "../config";

ReactGA.initialize(config.googleAnalyticsKey);

export function logReviewEvent(cardId) {
  ReactGA.set({ cardId });
  ReactGA.event({
    category: "User",
    action: "Reviewed a card",
  });
}

export function logFinishedEvent(deckId) {
  ReactGA.set({ deckId });
  ReactGA.event({
    category: "User",
    action: "Finished reviewing a deck",
  });
}

export function logReviewAgainEvent(deckId) {
  ReactGA.set({ deckId });
  ReactGA.event({
    category: "User",
    action: "Clicked review again",
  });
}

export function logStarDeckEvent(deckId) {
  ReactGA.set({ deckId });
  ReactGA.event({
    category: "User",
    action: "Starred a deck",
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
