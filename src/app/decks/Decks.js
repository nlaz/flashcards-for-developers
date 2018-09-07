import React, { Component } from "react";
import queryString from "query-string";

import config from "../../config";
import * as api from "../apiActions";
import * as analytics from "../../components/GoogleAnalytics";
import * as localStorage from "../utils/savedDecks";
import isAuthenticated from "../utils/isAuthenticated";
import Octicon from "../../components/Octicon";
import SkillProgress from "./SkillProgress";
import HabitTracker from "./HabitTracker";
import FeedbackForm from "./FeedbackForm";
import DeckItem from "./DeckItem";

const HOMEPAGE_COLLECTION_ID = "recUROLxLzjGsSh8P";

const TABS = {
  ALL: "all",
  USER: "user",
};

class Decks extends Component {
  state = {
    collection: {},
    decks: [],
    isLoading: true,
    isError: false,
    activeTab: TABS.ALL,
    savedDecks: [],
  };

  componentWillMount() {
    document.title = "Flashcards for Developers";
    const searchParams = queryString.parse(this.props.location.search);
    const authenticated = isAuthenticated();

    if (searchParams.beta) {
      this.fetchDecks();
    } else {
      this.fetchCollection(HOMEPAGE_COLLECTION_ID);
    }

    if (authenticated) {
      this.fetchSavedDecks();
    } else {
      this.setState({ savedDecks: localStorage.getSavedDecks() });
    }
  }

  onToggleSave = (event, deck) => {
    event.preventDefault();

    analytics.logSaveDeckAction(this.isSaved(deck.id), deck.name);

    this.saveDeck(deck);
  };

  sortDecks = decks => [...decks].sort((a, b) => b.new - a.new);

  fetchCollection = id => {
    api.fetchCollection(id).then(collection => {
      this.setState({ collection }, () => this.fetchDecks(collection));
    });
  };

  fetchDecks = collection => {
    api.fetchDecks(collection.id).then(
      ({ data }) => {
        this.setState({ decks: this.sortDecks(data), isLoading: false });
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
  };

  fetchSavedDecks = () => {
    api.fetchSavedDecks().then(response => {
      this.setState({ savedDecks: response.data });
    });
  };

  saveDeck = deck => {
    const savedDecks = this.isSaved(deck.id)
      ? this.state.savedDecks.filter(el => el !== deck.id)
      : [...this.state.savedDecks, deck.id];

    if (isAuthenticated()) {
      api
        .setSavedDecks(savedDecks)
        .then(response =>
          this.setState({ savedDecks }, () => localStorage.setSavedDecks(savedDecks)),
        )
        .catch(error => console.log(error));
    } else {
      this.setState({ savedDecks }, () => localStorage.setSavedDecks(savedDecks));
    }
  };

  isSaved = id => this.state.savedDecks.includes(id);

  render() {
    const { location } = this.props;
    const { decks, isLoading, isError, savedDecks, activeTab } = this.state;

    if (isLoading) {
      return (
        <div className="container p-4 my-5">
          <div className="mb-5">
            <h1 className="m-0">Flashcards for Developers</h1>
            <p>A curated list of flashcards to boost your professional skills</p>
          </div>
          <h1 className="text-secondary">Loading decks...</h1>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="container p-4 my-5">
          <div className="mb-5">
            <h1 className="m-0">Flashcards for Developers</h1>
            <p>A curated list of flashcards to boost your professional skills</p>
          </div>
          <div className="text-center mt-3">
            <h1 className="text-dark">Unable to load request</h1>
            <p>Please try again or contact us.</p>
          </div>
        </div>
      );
    }

    const filteredDecks =
      activeTab === TABS.USER ? decks.filter(el => savedDecks.includes(el.id)) : decks;

    return (
      <div className="container container--full px-4 my-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
          <div className="mb-3">
            <h1 className="m-0">Flashcards for Developers</h1>
            <p className="m-0">A curated list of flashcards to boost your professional skills</p>
          </div>
          <div
            className="bg-light rounded p-3 mb-2 border border-secondary d-flex align-items-center"
            style={{ minWidth: "260px", minHeight: "90px" }}
          >
            {activeTab === TABS.USER ? <SkillProgress decks={filteredDecks} /> : <HabitTracker />}
          </div>
        </div>
        <div className="d-flex mx-2">
          <button
            className="btn px-2 py-1 m-1 rounded-0"
            onClick={() => this.setState({ activeTab: TABS.ALL })}
          >
            <small
              className="text-uppercase font-weight-medium"
              style={{ opacity: activeTab === TABS.ALL ? 1 : 0.5 }}
            >
              All Decks
            </small>
          </button>
          <button
            className="btn px-2 py-1 m-1 rounded-0"
            onClick={() => this.setState({ activeTab: TABS.USER })}
          >
            <small
              className="text-uppercase font-weight-medium"
              style={{ opacity: activeTab === TABS.USER ? 1 : savedDecks.length > 0 ? 0.5 : 0.2 }}
            >
              My Decks {savedDecks.length > 0 && <span>{savedDecks.length}</span>}
            </small>
          </button>
        </div>
        <hr className="mb-2 mt-0" />
        {filteredDecks.length > 0 ? (
          <div className="row pt-1">
            {filteredDecks.map(deck => (
              <DeckItem
                deck={deck}
                key={deck.id}
                location={location}
                isSaved={this.isSaved(deck.id)}
                onToggleSave={this.onToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="w-100 text-center my-5 pb-5" style={{ minHeight: "30vh" }}>
            <span className="pb-5" style={{ opacity: 0.3 }}>
              No currently saved decks
            </span>
          </div>
        )}
        {activeTab === TABS.ALL && (
          <div className="row d-flex justify-content-center mt-2 mb-5">
            <a
              className="text-dark d-flex align-items-center btn btn-outline-dark"
              href={config.airtableSuggestionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderRadius: "999px" }}
            >
              <Octicon className="d-flex mr-2" name="plus" />
              <span>Suggest a deck</span>
            </a>
          </div>
        )}
        <div className="row">
          <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 mt-5">
            <FeedbackForm />
          </div>
        </div>
      </div>
    );
  }
}

export default Decks;
