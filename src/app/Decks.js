import React, { Component } from "react";
import { Link } from "react-router-dom";

import * as api from "./apiActions";
import * as analytics from "../components/GoogleAnalytics";
import ProgressBar from "../components/ProgressBar";

const FRONTEND_CATEGORY_ID = "recUROLxLzjGsSh8P";
const getProgress = deckId => {
  return localStorage.getItem(deckId) || 0;
};

const Deck = ({ deck }) => {
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
      </Link>
    </div>
  );
};

class Decks extends Component {
  state = { category: {}, decks: [] };

  componentWillMount() {
    this.fetchCategory(FRONTEND_CATEGORY_ID);
  }

  onStar = (event, deck) => {
    event.preventDefault();
    this.starDeck(deck);
  };

  fetchCategory = categoryId => {
    api.fetchCategory(categoryId).then(response => {
      this.setState({ category: response }, () => this.fetchDecks(response));
    });
  };

  fetchDecks = category => {
    api.fetchDecks(category).then(response => {
      this.setState({ decks: response });
    });
  };

  starDeck = deck => {
    api.updateDeck(deck.id, { Stars: deck.stars + 1 }).then(response => {
      analytics.logStarDeckEvent(deck.id);
      const decks = this.state.decks.map(el => (deck.id === el.id ? response : el));
      this.setState({ decks });
    });
  };

  render() {
    const { decks } = this.state;

    return (
      <div className="container p-4">
        <div className="mb-5">
          <h1 className="m-0">Flashcards for Frontend Development</h1>
          <p>A curated list of flashcards to boost your professional skills</p>
        </div>
        <div className="row mt-5 pt-5">
          {decks.map((deck, key) => <Deck deck={deck} key={key} />)}
        </div>
      </div>
    );
  }
}

export default Decks;
