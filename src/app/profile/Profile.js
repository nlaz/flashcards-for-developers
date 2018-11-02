import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import cookie from "js-cookie";

import * as api from "../apiActions";
import * as analytics from "../../components/GoogleAnalytics";

import Tab from "../../components/Tab";
import isAuthenticated from "../utils/isAuthenticated";
import SkillProgress from "../home/SkillProgress";
import OverviewSection from "./OverviewSection";
import PinnedSection from "./PinnedSection";
import DecksSection from "./DecksSection";

const TABS = {
  OVERVIEW: "overview",
  DECKS: "decks",
  PINNED: "pinned",
};

class Profile extends Component {
  state = {
    decks: [],
    pinnedDecks: [],
    studyProgress: [],
    activeTab: TABS.OVERVIEW,
    isError: false,
  };

  componentWillMount() {
    const { userId } = this.props.match.params;
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};
    if (userId !== user.id) {
      this.setState({ isRedirect: true });
    }
    const { params } = this.props.match;
    if (params.tabName && params.tabName.length > 0) {
      this.setState({ activeTab: params.tabName });
    }
  }

  componentWillUpdate(nextProps) {
    const { params } = nextProps.match;
    if (nextProps.match !== this.props.match) {
      if (params.tabName && params.tabName.length > 0) {
        this.setState({ activeTab: params.tabName });
      }
    }
  }

  componentDidMount() {
    this.fetchPinnedDecks();
    this.fetchStudyProgress();
    this.fetchDecksForUser();
  }

  onTabSelect = value => {
    const { userId } = this.props.match.params;
    this.props.history.push(`/${userId}/${value}`);
    this.setState({ activeTab: value });
  };

  onTogglePin = (event, deck) => {
    event.preventDefault();
    const isPinned = this.isPinned(deck.id);

    analytics.logPinDeckAction(deck.name, isPinned);

    this.togglePinnedDeck(deck, isPinned);
  };

  fetchPinnedDecks = () => {
    api
      .fetchPinnedDecks()
      .then(({ data }) => this.setState({ pinnedDecks: data }))
      .catch(error => console.error(error));
  };

  fetchStudyProgress = () => {
    api
      .fetchStudyProgress()
      .then(response => this.setState({ studyProgress: response.data }))
      .catch(error => console.error(error));
  };

  fetchDecksForUser = () => {
    api
      .fetchDecksForUser()
      .then(response => this.setState({ decks: response.data }))
      .catch(error => console.error(error));
  };

  togglePinnedDeck = (deck, isPinned) => {
    if (isAuthenticated()) {
      api
        .togglePinnedDeck(deck.id, isPinned)
        .then(({ data }) => this.setState({ pinnedDecks: data }))
        .catch(this.handleError);
    }
  };

  onGoTo = () => this.props.history.push("/settings/profile");

  isPinned = id => this.state.pinnedDecks.find(el => el.id === id);
  getDeckProgress = id => this.state.studyProgress.find(el => el.deck === id);

  render() {
    const { decks, pinnedDecks, activeTab, isRedirect, studyProgress } = this.state;
    const authenticated = isAuthenticated();
    const user = authenticated ? JSON.parse(cookie.get("user")) : {};

    if (isRedirect) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <div
          className="profile-header pt-4"
          style={{ background: "#f9f9f9", borderBottom: "1px solid #e8e8e8" }}
        >
          <div className="container container--full">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img className="profile-image rounded" src={user.avatar_url} alt="User profile" />
                <div className="ml-3">
                  <h1>{user.name}</h1>
                  <button
                    onClick={this.onGoTo}
                    className="btn btn-sm btn-white text-uppercase d-flex align-items-center px-3"
                  >
                    <small className="font-weight-medium">Edit Bio</small>
                  </button>
                </div>
              </div>
              <div
                className="bg-white rounded px-3 py-2 mb-2 d-flex align-items-center"
                style={{ minWidth: "260px", minHeight: "90px", border: "1px solid #d3d3d3" }}
              >
                <SkillProgress decks={[...decks, ...pinnedDecks]} studyProgress={studyProgress} />
              </div>
            </div>

            <div className="d-flex mt-3">
              <Tab
                onClick={() => this.onTabSelect(TABS.OVERVIEW)}
                active={activeTab === TABS.OVERVIEW}
              >
                Overview
              </Tab>
              <Tab onClick={() => this.onTabSelect(TABS.DECKS)} active={activeTab === TABS.DECKS}>
                Decks ({decks.length})
              </Tab>
              <Tab onClick={() => this.onTabSelect(TABS.PINNED)} active={activeTab === TABS.PINNED}>
                Pinned ({pinnedDecks.length})
              </Tab>
            </div>
          </div>
        </div>

        {activeTab === TABS.OVERVIEW && (
          <OverviewSection
            pinnedDecks={pinnedDecks}
            studyProgress={studyProgress}
            onTogglePin={this.onTogglePin}
          />
        )}

        {activeTab === TABS.DECKS && (
          <DecksSection
            userId={user.id}
            decks={decks}
            pinnedDecks={pinnedDecks}
            studyProgress={studyProgress}
            onTogglePin={this.onTogglePin}
          />
        )}

        {activeTab === TABS.PINNED && (
          <PinnedSection
            pinnedDecks={pinnedDecks}
            studyProgress={studyProgress}
            onTogglePin={this.onTogglePin}
          />
        )}
      </div>
    );
  }
}

export default Profile;
