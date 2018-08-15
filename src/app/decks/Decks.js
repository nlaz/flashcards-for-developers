import React, { Component } from "react";
import moment from "moment";
import queryString from "query-string";

import config from "../../config";
import * as api from "../apiActions";
import * as analytics from "../../components/GoogleAnalytics";
import * as leitner from "../../spaced/leitner";
import Octicon from "../../components/Octicon";
import SkillProgress from "./SkillProgress";
import FeedbackForm from "./FeedbackForm";
import DeckItem from "./DeckItem";

const FRONTEND_CATEGORY_ID = "recUROLxLzjGsSh8P";

const getStudyObj = (deckId, progress) => {
  return {
    progress: progress,
    reviewedAt: moment(),
    leitnerBox: 1,
  };
};

export const getProgress = deckId => {
  let studyObj = JSON.parse(localStorage.getItem(deckId)) || {};

  if (typeof studyObj === "number") {
    studyObj = getStudyObj(deckId, studyObj);
    localStorage.setItem(deckId, JSON.stringify(studyObj));
  }

  return studyObj.progress || 0;
};

export const getProficiency = deckId => {
  let studyObj = JSON.parse(localStorage.getItem(deckId)) || {};

  if (typeof studyObj === "number") {
    studyObj = getStudyObj(deckId, studyObj);
    localStorage.setItem(deckId, JSON.stringify(studyObj));
  }

  const { reviewedAt, leitnerBox } = studyObj;

  return leitner.getProficiency(leitnerBox, reviewedAt) || 0;
};

const FILTERS = {
  NEWEST: "newest",
  POPULAR: "popular",
};

const TABS = {
  ALL: "all",
  USER: "user",
};

class Decks extends Component {
  state = {
    category: {},
    decks: [],
    isLoading: true,
    isError: false,
    filter: FILTERS.POPULAR,
    activeTab: TABS.ALL,
    savedDecks: [],
  };

  componentWillMount() {
    document.title = "Flashcards for Developers";
    const searchParams = queryString.parse(this.props.location.search);

    if (searchParams.beta) {
      this.fetchDecks();
    } else {
      this.fetchCategory(FRONTEND_CATEGORY_ID);
    }
    const savedDecks = JSON.parse(localStorage.getItem("savedDecks")) || [];
    this.setState({ savedDecks });
  }

  onToggleSave = (event, deck) => {
    event.preventDefault();

    analytics.logSaveDeckAction(this.isSaved(deck.id));

    this.saveDeck(deck);
  };

  onSetFilter = filter =>
    this.setState({ filter, decks: this.sortDecks(this.state.decks, filter) });

  sortDecks = (decks, filter) => [...decks].sort((a, b) => b.new - a.new);

  fetchCategory = categoryId => {
    api.fetchCategory(categoryId).then(response => {
      this.setState({ category: response }, () => this.fetchDecks(response));
    });
  };

  fetchDecks = category => {
    api.fetchDecks(category).then(
      response => {
        this.setState({ decks: this.sortDecks(response, this.state.filter), isLoading: false });
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
  };

  saveDeck = deck => {
    const savedDecks = this.isSaved(deck.id)
      ? this.state.savedDecks.filter(el => el !== deck.id)
      : [...this.state.savedDecks, deck.id];

    this.setState({ savedDecks }, () => {
      localStorage.setItem("savedDecks", JSON.stringify(savedDecks));
    });
  };

  isSaved = id => this.state.savedDecks.includes(id);

  render() {
    const { location } = this.props;
    const { decks, isLoading, isError, savedDecks, activeTab } = this.state;

    if (isLoading) {
      return (
        <div className="container p-4 my-5">
          <div className="mb-5">
            <h1 className="m-0">Flashcards for Frontend Developers</h1>
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
            <h1 className="m-0">Flashcards for Frontend Developers</h1>
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
      <div className="container p-4 my-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
          <div className="mb-3">
            <h1 className="m-0">Flashcards for Frontend Developers</h1>
            <p className="m-0">A curated list of flashcards to boost your professional skills</p>
          </div>
          <div>
            <li className="text-support list-inline-item">
                <a
                  href={config.buyMeACoffeeDonateUrl}
                  onClick={() => analytics.logDonateEvent3}
                  target="_blank"
                  className="text-support_align text-secondary"
                  rel="noopener noreferrer"
                >
                  Support Us
                </a>
            </li>
            <SkillProgress decks={filteredDecks} />
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
          <div className="w-100 text-center my-5 pb-5">
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
            <FeedbackForm 
              onClickConversation={() => analytics.logFeedbackEvent} 
              onClickDonate={() => analytics.logDonateEvent1}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Decks;
