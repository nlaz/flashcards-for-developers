import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import cookie from "js-cookie";

import * as api from "../apiActions";
import * as analytics from "../../components/GoogleAnalytics";

import isProMember from "../utils/isProMember";
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
    profile: {},
    pinnedDecks: [],
    studyProgress: [],
    activeTab: TABS.OVERVIEW,
    isError: false,
  };

  componentWillMount() {
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
    const { username } = this.props.match.params;
    this.fetchUserPinnedDecks(username);
    this.fetchStudyProgress(username);
    this.fetchDecksForUser(username);
  }

  onTabSelect = value => {
    const { username } = this.props.match.params;
    this.props.history.push(`/${username}/${value}`);
    this.setState({ activeTab: value });
  };

  onTogglePin = (event, deck) => {
    event.preventDefault();
    const isPinned = this.isPinned(deck.id);

    analytics.logPinDeckAction(deck.name, isPinned);

    this.togglePinnedDeck(deck, isPinned);
  };

  fetchUserPinnedDecks = username => {
    api
      .fetchUserPinnedDecks(username)
      .then(({ data }) => this.setState({ pinnedDecks: data }))
      .catch(error => console.error(error));
  };

  fetchStudyProgress = username => {
    api
      .fetchUserStudyProgress(username)
      .then(response => this.setState({ studyProgress: response.data }))
      .catch(error => console.error(error));
  };

  fetchDecksForUser = username => {
    api
      .fetchDecksForUser(username)
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

  isPageOwner = () =>
    isAuthenticated() &&
    JSON.parse(cookie.get("user")).username === this.props.match.params.username;
  isPinned = id => this.state.pinnedDecks.find(el => el.id === id);
  getDeckProgress = id => this.state.studyProgress.find(el => el.deck === id);

  render() {
    const { profile } = this.props;
    const { decks, pinnedDecks, activeTab, isRedirect, studyProgress } = this.state;

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
            <div className="d-flex flex-column-reverse flex-lg-row justify-content-between align-items-lg-center">
              <div className="d-flex align-items-center">
                <div className="profile-image rounded position-relative bg-light my-2">
                  {profile.avatar_url && (
                    <img
                      className="profile-image rounded"
                      src={profile.avatar_url}
                      alt="User profile"
                    />
                  )}
                  {isProMember() && (
                    <span
                      role="img"
                      aria-label="emoji"
                      className="position-absolute"
                      style={{ fontSize: "1.5em", bottom: "-10px", right: "-5px" }}
                    >
                      🌟
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <h1 className="m-0">{profile.name}</h1>
                  {profile.username && <h6 className="text-muted m-0">@{profile.username}</h6>}
                  {this.isPageOwner() && (
                    <button
                      onClick={this.onGoTo}
                      className="btn btn-sm btn-white text-uppercase d-flex align-items-center px-3 mt-2"
                    >
                      <small className="font-weight-medium">Edit Bio</small>
                    </button>
                  )}
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
            decks={decks}
            pinnedDecks={pinnedDecks}
            studyProgress={studyProgress}
            onTogglePin={this.onTogglePin}
            isPageOwner={this.isPageOwner()}
          />
        )}

        {activeTab === TABS.DECKS && (
          <DecksSection
            userId={profile.id}
            decks={decks}
            pinnedDecks={pinnedDecks}
            studyProgress={studyProgress}
            onTogglePin={this.onTogglePin}
            isPageOwner={this.isPageOwner()}
          />
        )}

        {activeTab === TABS.PINNED && (
          <PinnedSection
            pinnedDecks={pinnedDecks}
            studyProgress={studyProgress}
            onTogglePin={this.onTogglePin}
            isPageOwner={this.isPageOwner()}
          />
        )}
      </div>
    );
  }
}

export default Profile;
