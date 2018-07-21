import React, { Component } from "react";
import { Link } from "react-router-dom";
import pluralize from "pluralize";
import moment from "moment";
import cx from "classnames";

import config from "../config";
import * as api from "./apiActions";
import * as analytics from "../components/GoogleAnalytics";
import ProgressBar from "../components/ProgressBar";
import Octicon from "../components/Octicon";
import { Cell, PieChart, Pie, Label } from "recharts";
import * as leitner from "../spaced/leitner";

const FRONTEND_CATEGORY_ID = "recUROLxLzjGsSh8P";

const getStudyObj = (deckId, progress) => {
  return {
    progress: progress,
    reviewedAt: moment(),
    leitnerBox: 1,
  };
};

const getProgress = deckId => {
  let studyObj = JSON.parse(localStorage.getItem(deckId)) || {};

  if (typeof studyObj === "number") {
    studyObj = getStudyObj(deckId, studyObj);
    localStorage.setItem(deckId, JSON.stringify(studyObj));
  }

  return studyObj.progress || 0;
};

const getProficiency = deckId => {
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

const Deck = ({ deck, onStar }) => {
  const progress = getProgress(deck.id);
  const proficiency = getProficiency(deck.id);
  return (
    <div className="deck-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <Link
        to={`/decks/${deck.id}`}
        className={cx(
          "border rounded d-flex flex-column justify-content-between text-dark mb-3 p-4 w-100 position-relative",
          deck.new ? "border-dark" : "border-dark",
        )}
        disabled={!deck.cards}
        style={{
          fontSize: "14px",
          opacity: deck.cards ? 1 : 0.25,
        }}
      >
        <div>
          <ProgressBar className="mb-2" progress={progress} proficiency={proficiency} />
          {deck.name}
          {deck.new && (
            <div
              className="badge badge-primary ml-2 position-absolute"
              style={{ bottom: "16px", right: "18px" }}
            >
              New
            </div>
          )}
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

  const proficiency =
    decks.reduce((avg, el) => {
      return getProgress(el.id) > 0 ? avg + getProficiency(el.id) : avg;
    }, 0.0) / numPractices;

  const subProgress = progress * proficiency;

  const progressData = [
    { name: "Offset", value: 100 - progress },
    { name: "Progress", value: progress - subProgress },
    { name: "Proficiency", value: subProgress },
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
          startAngle={90}
          endAngle={360 + 90}
          isAnimationActive={false}
          stroke="none"
        >
          <Cell fill="#e1e1e2" />
          <Cell fill="#cfcfcf" />
          <Cell fill="#343a40" />
          <Label
            className="font-weight-bold"
            fill="#343a40"
            position="center"
            style={{ fontSize: "16px" }}
            value={`${subProgress.toFixed()}%`}
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
    document.title = "Flashcards for Developers";
    this.fetchCategory(FRONTEND_CATEGORY_ID);
  }

  onStar = (event, deck) => {
    event.preventDefault();
    this.starDeck(deck);
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
        <div className="row">
          <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 mt-5">
            <div className="border border-secondary rounded p-4 text-center bg-light">
              <div className="mx-auto" style={{ maxWidth: "500px" }}>
                <span>
                  Join our community on Slack for news on exciting features, new content, and to
                  meet awesome people like you.{" "}
                  <span role="img" aria-label="Tada emoji">
                    🎉
                  </span>
                </span>
                <div className="mt-3">
                  <a
                    href={config.slackinUrl}
                    onClick={() => analytics.logJoinSlackEvent()}
                    className="btn btn-dark py-2"
                  >
                    <i className="fab fa-slack fa-lg mr-1" />
                    Join our Slack Channel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Decks;
