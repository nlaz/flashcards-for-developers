import React, { Component } from "react";
import { Link } from "react-router-dom";
import pluralize from "pluralize";

import config from "../config";
import * as api from "./apiActions";
import * as analytics from "../components/GoogleAnalytics";
import ProgressBar from "../components/ProgressBar";
import Octicon from "../components/Octicon";
import { Cell, PieChart, Pie, Label } from "recharts";

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
    <div className="deck-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <Link
        to={`/decks/${deck.id}`}
        className="border border-dark rounded d-flex flex-column justify-content-between text-dark mb-3 p-4 w-100 position-relative"
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

const SkillProgress = ({ decks }) => {
  const progress = Math.round(
    decks.reduce((avg, el) => avg + getProgress(el.id) * 100, 0) / decks.length,
  );
  const numPractices = decks.filter(el => getProgress(el.id) > 0).length;

  const progressData = [
    { name: "Progress", value: progress },
    { name: "Offset", value: 100 - progress },
  ];

  if (!progress) {
    return false;
  }

  return (
    <div
      className="d-flex flex-row-reverse flex-lg-row justify-content-end justify-content-lg-center align-items-center mb-2 bg-light rounded p-2 border border-secondary"
      style={{ minWidth: "260px" }}
    >
      <div className="mx-2">
        <p
          className="m-0 text-uppercase font-weight-medium"
          style={{ fontSize: "14px", lineHeight: "12px" }}
        >
          Skill Progress
        </p>
        <p className="text-secondary m-0" style={{ fontSize: "14px" }}>
          You practiced {pluralize("skill", numPractices, true)}
        </p>
      </div>
      <PieChart height={70} width={70}>
        <Pie
          data={progressData}
          dataKey="value"
          innerRadius={24}
          outerRadius={35}
          startAngle={90 - progress / 100 * 360}
          endAngle={360 + 90}
          isAnimationActive={false}
          stroke="none"
        >
          <Cell fill="#343a40" />
          <Cell fill="#e1e1e2" />
          <Label
            className="font-weight-bold"
            fill="#343a40"
            position="center"
            style={{ fontSize: "16px" }}
            value={`${progress}%`}
          />
        </Pie>
      </PieChart>
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
    const { decks, isLoading, isError } = this.state;

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
        <div className="mb-2 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
          <div className="mb-3">
            <h1 className="m-0">Flashcards for Frontend Developers</h1>
            <p className="m-0">A curated list of flashcards to boost your professional skills</p>
          </div>
          <SkillProgress decks={decks} />
        </div>
        <div className="row mt-4">
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
