import { Component } from "react";
import ReactGA from "react-ga";
import config from "../config";
import queryString from "query-string";

ReactGA.initialize(config.googleAnalyticsKey);

export function logTwitterShare() {
  ReactGA.event({
    category: "SocialMedia",
    action: "Pressed the Twitter Share Button",
  });
}

export function logDeckFeedback(value, deckId) {
  ReactGA.event({
    category: "User Feedback",
    action: `Voted ${value} on deck`,
    label: deckId,
  });
}

export function logFacebookShare() {
  ReactGA.event({
    category: "SocialMedia",
    action: "Pressed the Facebook Share Button",
  });
}

export function logReviewEvent(cardId) {
  ReactGA.event({
    category: "User",
    action: "Reviewed a card",
    label: cardId,
  });
}

export function logCompletedEvent(deckId) {
  ReactGA.event({
    category: "User",
    action: "Completed a deck stage",
    label: deckId,
  });
}

export function logFinishedEvent(deckId) {
  ReactGA.event({
    category: "User",
    action: "Finished reviewing a deck",
    label: deckId,
  });
}

export function logKeepGoingEvent(deckId) {
  ReactGA.event({
    category: "User",
    action: "Clicked keep going",
    label: deckId,
  });
}

export function logStarDeckEvent(deckId) {
  ReactGA.event({
    category: "User",
    action: "Starred a deck",
    label: deckId,
  });
}

export function logFeedbackEvent() {
  ReactGA.event({
    category: "User",
    action: "Clicked on 'Start converation' button",
  });
}

export function logGithubInterest() {
  ReactGA.event({
    category: "User",
    action: "Clicked on 'Github' button in Footer",
  });
}

export function logPinDeckAction(deckName, isPinned) {
  ReactGA.event({
    category: "User",
    action: !isPinned ? "Pinned a deck" : "Unpinned a deck",
    label: deckName,
  });
}

export function logPressedSubscribe() {
  ReactGA.event({
    category: "User",
    action: "Clicked on 'Subscribe' button",
  });
}

export function logToggleFamiliarCards(isChecked) {
  ReactGA.event({
    category: "User",
    action: !isChecked ? "Unchecked 'Hide familiar cards'" : "Checked 'Hide familiar cards'",
  });
}

export function logUserAction(action) {
  ReactGA.event({
    category: "User",
    action: action,
  });
}

export function logLoginAction(action) {
  ReactGA.event({
    category: "User Login",
    action: action,
  });
}

export function logProAction(action) {
  ReactGA.event({
    category: "User Pro",
    action: action,
  });
}

export function logMembershipAction(action) {
  ReactGA.event({
    category: "User Membership",
    action: action,
  });
}

class GoogleAnalytics extends Component {
  componentWillMount() {
    const searchParams = queryString.parse(this.props.location.search);
    if (searchParams.beta) {
      window[`ga-disable-${config.googleAnalyticsKey}`] = true;
    }
  }

  render() {
    ReactGA.set({ page: window.location.pathname + window.location.hash });
    ReactGA.pageview(window.location.pathname + window.location.hash);
    return null;
  }
}

export default GoogleAnalytics;
