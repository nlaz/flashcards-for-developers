import React, { Component } from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import config from "../config";
import * as api from "./apiActions";
import * as analytics from "../components/GoogleAnalytics";
import ProgressBar from "../components/ProgressBar";
import Octicon from "../components/Octicon";

const FRONTEND_CATEGORY_ID = "recUROLxLzjGsSh8P";
const getProgress = deckId => {
  return localStorage.getItem(deckId) || 0;
};

const FILTERS = {
  NEWEST: "newest",
  POPULAR: "popular",
};

const Deck = ({ deck, onStar }) => {
  const progress = getProgress(deck.id);
  return (
    <div className="col-6 col-md-4 col-lg-3 d-flex pb-2" style={{ height: "240px" }}>
      <Link
        to={`/decks/${deck.id}`}
        className="border border-dark rounded d-flex flex-column justify-content-between text-dark mb-4 p-4 w-100 position-relative"
        disabled={!deck.cards}
        style={{
          fontSize: "14px",
          opacity: deck.cards ? 1 : 0.25,
        }}
      >
        <div>
          <ProgressBar className="mb-2" percent={progress} />
          {deck.name}
        </div>

        <div className="position-absolute m-0 pr-3 pb-2" style={{ bottom: 0, right: 0 }}>
          <button onClick={e => onStar(e, deck)} className="deck-star d-flex align-items-center">
            <span className="mr-1 d-flex">{deck.stars}</span>
            <Octicon name="star" className="d-flex" />
          </button>
        </div>
      </Link>
    </div>
  );
};

class Decks extends Component {
  state = {
    category: {},
    decks: [],
    isLoading: true,
    isError: false,
    filter: FILTERS.POPULAR,
  };

  componentWillMount() {
    this.fetchCategory(FRONTEND_CATEGORY_ID);
  }

  onStar = (event, deck) => {
    event.preventDefault();
    this.starDeck(deck);
  };

  onSetFilter = filter =>
    this.setState({ filter, decks: this.sortDecks(this.state.decks, filter) });

  sortDecks = (decks, filter) =>
    [...decks].sort((a, b) => {
      return filter === FILTERS.NEWEST
        ? new Date(b.createdTime) - new Date(a.createdTime)
        : b.stars - a.stars;
    });

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

  starDeck = deck => {
    api.updateDeck(deck.id, { Stars: (deck.stars || 0) + 1 }).then(response => {
      analytics.logStarDeckEvent(deck.id);
      const decks = this.state.decks.map(el => (deck.id === el.id ? response : el));
      this.setState({ decks });
    });
  };

  render() {
    const { decks, isLoading, isError, filter } = this.state;

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

    return (
      <div className="container p-4 my-5">
        <div className="mb-5">
          <h1 className="m-0">Flashcards for Frontend Developers</h1>
          <p>A curated list of flashcards to boost your professional skills</p>
        </div>
        <div className="text-right ml-auto mt-5">
          <button
            onClick={() => this.onSetFilter(FILTERS.POPULAR)}
            className={cx("badge badge-pill mr-2", { "badge-dark": filter === FILTERS.POPULAR })}
          >
            Popular
          </button>
          <button
            onClick={() => this.onSetFilter(FILTERS.NEWEST)}
            className={cx("badge badge-pill", { "badge-dark": filter === FILTERS.NEWEST })}
          >
            Newest
          </button>
        </div>
        <div className="row mt-3">
          {decks.map(deck => <Deck deck={deck} key={deck.id} onStar={this.onStar} />)}
        </div>
        <div className="row d-flex justify-content-center mt-3">
          <a
            className="text-dark d-flex align-items-center"
            href={config.airtableSuggestionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Octicon className="d-flex mr-2" name="plus" />
            <span>Suggest a deck</span>
          </a>
        </div>
      </div>
    );
  }
}

export default Decks;
