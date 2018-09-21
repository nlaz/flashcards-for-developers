import React, { Component } from "react";
import cx from "classnames";
import marked from "marked";
import Chance from "chance";
import moment from "moment";

import config from "../../config";
import isAuthenticated from "../utils/isAuthenticated";
import * as leitner from "../../spaced/leitner";
import * as api from "../apiActions";
import * as localStorage from "../utils/localStorage";
import * as studyProgress from "../utils/studyProgress";
import * as analytics from "../../components/GoogleAnalytics";

import DeckFeedback from "./DeckFeedback";
import ReviewHeader from "./ReviewHeader";
import StudyProgress from "./StudyProgress";
import StudyToggle from "./StudyToggle";
import ReviewResults from "./ReviewResults";

import "./Review.css";

const chance = new Chance();
const PAGE_SIZE = 8;
const SELF_GRADE_CORRECT = "I was right";
const SELF_GRADE_INCORRECT = "I was wrong";

const getRandomPageSize = () => chance.integer({ min: PAGE_SIZE - 2, max: PAGE_SIZE + 1 });

const ReviewType = ({ type }) => (
  <div
    className="badge badge-pill badge-light text-secondary position-absolute mr-4"
    style={{ top: "12px", right: "0" }}
  >
    {type}
  </div>
);

const ReportLink = ({ content }) => (
  <a
    href={config.airtableReportUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-reset position-absolute d-flex align-items-center"
    style={{ right: 0, bottom: 0, fill: "#cdcdcd", color: "#cdcdcd" }}
  >
    <small>{content}</small>
  </a>
);

class Review extends Component {
  state = {
    deck: {},
    cards: [],
    correctness: [],
    options: [],
    index: 0,
    isWrong: false,
    isDeckLoading: true,
    isCardsLoading: true,
    isError: false,
    isReversed: false,
    isRevealed: false,
    numCorrect: 0,
    numIncorrect: 0,
    selected: {},
    cardProgress: [],
    pageSize: getRandomPageSize(),
    page: 0,
  };

  componentDidMount() {
    const { params } = this.props.match;

    if (this.isCollectionPage()) {
      this.fetchCollection(params.collectionId);
      this.fetchMixedCards(params.collectionId);
    } else {
      this.fetchDeck(params.deckId);
      this.fetchDeckProgress(params.deckId);
    }
    window.addEventListener("keyup", e => this.onKeyUp(e));
    window.addEventListener("keydown", e => this.onKeyDown(e));
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", e => this.onKeyUp(e));
    window.removeEventListener("keydown", e => this.onKeyDown(e));
    clearTimeout(this.timeout);
  }

  onKeyUp = e => {
    e.preventDefault();
    switch (e.key) {
      case " ": // spacebar key
        return this.onSpaceBarPress();
      case (e.key.match(/^[0-9]$/) || {}).input: // number key
        return this.onOptionPress(e.key);
      default:
        return;
    }
  };

  onKeyDown = e => {
    if (e.key === " ") {
      e.preventDefault();
      return false;
    }
  };

  onOptionPress = key => {
    const index = parseInt(key, 10) - 1;
    if (!this.isStageFinished()) {
      if (index >= 0 && index < this.state.options.length) {
        const answer = this.state.options[index];
        this.onSelectAnswer(answer);
      }
    }
  };

  onSpaceBarPress = () => {
    if (this.isStageFinished()) {
      this.onKeepGoing();
      // stage is finished, Reset correctness array
      this.setState({ correctness: [] });
    } else if (this.isSelfGraded() && !this.state.isRevealed) {
      this.onToggleReveal();
    }
  };

  onSelectAnswer = answer => {
    const isSelfGraded = this.isSelfGraded();

    if (isSelfGraded) {
      this.handleSelfGradedAnswer(answer);
    } else {
      this.handleMultipleChoiceAnswer(answer);
    }
  };

  onToggleReveal = () => {
    const { isRevealed, index, cards } = this.state;
    this.setState({ isRevealed: !isRevealed, options: this.getOptions(index, cards) });
  };

  onKeepGoing = () => {
    analytics.logKeepGoingEvent(this.state.deck.id);
    this.setState({ page: this.state.page + 1 });
  };

  onGoBack = () => {
    this.props.history.goBack();
  };

  onSRSToggle = value => {
    const { deck } = this.state;
    analytics.logToggleFamiliarCards(value);
    this.setState({ isCardsLoading: true }, () => this.fetchCards(deck));
  };

  handleSelfGradedAnswer = answer => {
    if (!this.state.isRevealed) {
      return;
    }

    const isCorrect = answer === SELF_GRADE_CORRECT;
    const card = this.getCurrentCard();

    analytics.logReviewEvent(card.id);
    this.setStudyProgress(card, isCorrect);

    this.setState({ correctness: [...this.state.correctness, isCorrect] });

    if (!isCorrect) {
      const numCorrect = this.state.numCorrect - 1;
      const numIncorrect = this.state.numIncorrect + 1;
      this.setState({ numCorrect, numIncorrect });
    }

    this.setState({ selected: answer });
    this.timeout = setTimeout(() => this.handleCorrectAnswer(), 300);
  };

  handleMultipleChoiceAnswer = answer => {
    const card = this.getCurrentCard();
    const isCorrect = this.isCorrectAnswer(answer, card);
    this.setState({ selected: answer });

    this.setStudyProgress(card, isCorrect);

    if (isCorrect) {
      this.setState({ correctness: [...this.state.correctness, isCorrect] });
      analytics.logReviewEvent(card.id);
      this.timeout = setTimeout(() => this.handleCorrectAnswer(), 300);
    } else {
      this.handleIncorrectAnswer(card);
    }
  };

  handleCorrectAnswer = () => {
    const { cards } = this.state;
    const index = Math.min(this.state.index + 1, cards.length);

    if (this.isStageFinished(index)) {
      this.logReviewEvent(index);
      this.setStudySession();
    }

    this.setState({
      index,
      selected: {},
      isRevealed: false,
      options: this.getOptions(index, cards),
      isReversed: this.isReversible(this.state.deck) && chance.bool(),
      numCorrect: this.state.numCorrect + 1,
    });
  };

  handleIncorrectAnswer = card => {
    const numIncorrect = this.state.numIncorrect + 1;
    this.setState({ isWrong: true, numIncorrect }, () => {
      this.timeout = setTimeout(() => this.setState({ isWrong: false }), 500);
    });
  };

  logReviewEvent = index => {
    if (this.isDeckCompleted(index)) {
      analytics.logCompletedEvent(this.state.deck.id);
    } else {
      analytics.logFinishedEvent(this.state.deck.id);
    }
  };

  fetchDeck = deckId => {
    api.fetchDeck(deckId).then(
      ({ data }) => {
        // TODO: Set the name on the server-side
        document.title = data.name ? `${data.name} Flashcards` : "Flashcards for Developers";
        this.setState({ deck: data, isDeckLoading: false }, () => this.fetchCards(data));
      },
      error => this.setState({ isError: true, isDeckLoading: false }),
    );
  };

  fetchCollection = collectionId => {
    api
      .fetchCollection(collectionId)
      .then(({ data }) => {
        this.setState({ deck: { ...data, type: "Self graded" }, isDeckLoading: false });
      })
      .catch(error => this.setState({ isError: true, isDeckLoading: false }));
  };

  fetchCards = deck => {
    api
      .fetchCards({ deck: deck.id })
      .then(this.handleCardsResponse)
      .catch(error => this.setState({ isError: true, isCardsLoading: false }));
  };

  fetchMixedCards = collectionId => {
    api
      .fetchCards({ collection: collectionId })
      .then(this.handleCardsResponse)
      .catch(error => this.setState({ isError: true, isCardsLoading: false }));
  };

  handleCardsResponse = ({ data }) => {
    const { index } = this.state;
    const isSRS = localStorage.getSRSPref();
    const filteredCards = isSRS ? this.filterExpiredCards(data) : data;
    const cards = chance.shuffle(filteredCards);
    const options = this.getOptions(index, cards);
    this.setState({ cards, options, index: 0, isCardsLoading: false });
  };

  fetchDeckProgress = deckId => {
    if (isAuthenticated()) {
      api
        .fetchDeckStudyProgress(deckId)
        .then(({ data }) => this.setState({ cardProgress: data.cards || [] }))
        .catch(this.handleError);
    } else {
      const deckProgress = localStorage.getDeckProgressObject(deckId);
      this.setState({ cardProgress: deckProgress.cards || [] });
    }
  };

  setStudyProgress = (card, isCorrect) => {
    const cardObj = this.state.cardProgress.find(el => el.card === card.id) || {};
    const { reviewedAt, leitnerBox } = studyProgress.calcUpdatedLevel(cardObj, isCorrect);

    if (isAuthenticated()) {
      api
        .addCardProgress(card.deck, card.id, leitnerBox, reviewedAt)
        .then(({ data }) => this.setState({ cardProgress: data.cards }))
        .catch(this.handleError);
    } else {
      const deckProgress = localStorage.addCardProgress(card.deck, card.id, leitnerBox, reviewedAt);
      this.setState({ cardProgress: deckProgress.cards });
    }
  };

  setStudySession = () => {
    const currentDate = moment().startOf("day");

    if (isAuthenticated()) {
      api.addStudySession(currentDate).catch(this.handleError);
    } else {
      localStorage.addStudySession(currentDate);
    }
  };

  handleError = error => console.error(error);

  filterExpiredCards = cards => {
    const { cardProgress = [] } = this.state;

    return cards.filter(card => {
      const cardObj = cardProgress.find(el => el.card === card.id);
      return !!cardObj ? leitner.isExpired(cardObj.leitnerBox, cardObj.reviewedAt) : true;
    });
  };

  getOptions = (index, cards) => {
    if (this.isSelfGraded()) {
      return [SELF_GRADE_CORRECT, SELF_GRADE_INCORRECT];
    } else if (this.isMultiple()) {
      return [...new Set(cards.map(el => el.back))].map((el, i) => ({ id: i, back: el }));
    } else {
      const random = chance.unique(chance.natural, Math.min(3, cards.length), {
        min: 0,
        max: cards.length - 1,
      });
      const uniqOptions = [...new Set([...random, index])];
      const opts = chance.shuffle(uniqOptions);
      return opts.map(el => cards[el]);
    }
  };

  getDeckType = () => (this.isSelfGraded() ? "Self graded" : "Multiple choice");
  getCurrentCard = () => this.state.cards[this.state.index];
  getCategoryUrl = id => `/categories/${id}`;
  getOptionHTML = option => marked(this.state.isReversed ? option.front : option.back || option);
  getCardHTML = card => marked(this.state.isReversed ? card.back : card.front);

  getPageStart = () => Math.max(Math.floor(this.state.page * this.state.pageSize), 0);
  getPageEnd = () =>
    Math.min(Math.floor((this.state.page + 1) * this.state.pageSize), this.state.cards.length);

  isCollectionPage = () => this.props.match.path === "/collections/:collectionId/review";
  isReversible = deck => (deck || this.state.deck).type === "Reversible select";
  isMultiple = deck => (deck || this.state.deck).type === "Multiple select";
  isSelfGraded = deck => (deck || this.state.deck).type === "Self graded";
  isImageSelect = deck => (deck || this.state.deck).type === "Image select";
  isStageFinished = index =>
    (index || this.state.index) >= Math.min(this.getPageEnd(), this.state.cards.length);
  isDeckCompleted = index => (index || this.state.index) > this.state.cards.length - 1;
  isCorrectAnswer = (option, card) => {
    if (this.isSelfGraded()) {
      return option === SELF_GRADE_CORRECT;
    } else if (this.isMultiple()) {
      return option.back === card.back;
    } else {
      return option.id === card.id;
    }
  };

  isSelected = option =>
    option.id ? this.state.selected.id === option.id : this.state.selected === option;

  render() {
    const { deck, options, index, isDeckLoading, isCardsLoading, isError } = this.state;

    if (isDeckLoading) {
      return (
        <div className="container container--narrow px-0">
          <div className="p-4 text-center w-100">
            <h5 className="text-secondary">
              <i className="fas fa-spinner fa-spin mr-1" />
              Loading deck...
            </h5>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="container container--narrow px-0">
          <div className="text-center p-4">
            <h1 className="text-dark">Unable to load request</h1>
            <p>Please try again or go back home.</p>
          </div>
        </div>
      );
    }

    const currentCard = this.getCurrentCard();
    const pageEnd = this.getPageEnd();
    const pageStart = this.getPageStart();
    const isStageFinished = this.isStageFinished();

    return (
      <div>
        <div className="container container--narrow py-5">
          <ReviewHeader deck={deck} className="mb-5" />
          <div className="flashcard-container row mt-4 px-3">
            <div className="d-flex justify-content-between w-100 m-2">
              <StudyToggle onChange={this.onSRSToggle} />
              <StudyProgress
                index={index}
                items={this.state.cards}
                pageSize={this.state.pageSize}
                pageEnd={pageEnd}
                pageStart={pageStart}
                isFinished={isStageFinished}
                correctness={this.state.correctness}
              />
            </div>
            <div
              className={cx(
                "wrapper col-12 border border-dark rounded mb-4 py-5 d-flex align-items-stretch",
                {
                  shake: this.state.isWrong,
                },
              )}
            >
              {!isCardsLoading && (
                <div className="row w-100 mx-0">
                  {!isStageFinished ? (
                    <div className="row w-100 mx-0">
                      <ReviewType type={this.getDeckType()} />
                      <div className="col-12 col-lg-6 d-flex align-items-center px-1 pb-2">
                        {this.isImageSelect(deck) ? (
                          <img className="img-fluid px-3 mx-auto" alt="" src={currentCard.front} />
                        ) : (
                          <div className="flashcard-body border rounded px-3 py-5 w-100 h-100">
                            <div
                              className="markdown-body text-left d-flex align-items-center justify-content-center flex-column"
                              dangerouslySetInnerHTML={{
                                __html: this.getCardHTML(currentCard),
                              }}
                            />
                            {this.state.isRevealed && (
                              <div
                                className="markdown-body text-left d-flex align-items-center justify-content-center flex-column mt-3 pt-3"
                                style={{ borderTop: "1px solid #f5f5f5" }}
                                dangerouslySetInnerHTML={{
                                  __html: marked(currentCard.back),
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-lg-6 d-flex flex-column align-items-stretch px-1 pb-1">
                        {options.map((option, key) => (
                          <div
                            key={option.id || option}
                            onClick={() => this.onSelectAnswer(option)}
                            className={cx(
                              "flashcard-option border rounded d-flex align-items-start p-3 w-100",
                              {
                                "flashcard-option--disabled":
                                  this.isSelfGraded() && !this.state.isRevealed,
                                "border-success text-success":
                                  this.isSelected(option) &&
                                  this.isCorrectAnswer(option, currentCard),
                                "border-danger text-danger":
                                  this.isSelected(option) &&
                                  !this.isCorrectAnswer(option, currentCard),
                              },
                            )}
                          >
                            <div className="border rounded mr-3 px-2" style={{ fontSize: ".9em" }}>
                              {key + 1}
                            </div>
                            <div
                              className="markdown-body text-left bg-white w-100"
                              dangerouslySetInnerHTML={{
                                __html: this.getOptionHTML(option),
                              }}
                            />
                          </div>
                        ))}
                        {this.isSelfGraded() &&
                          !this.state.isRevealed && (
                            <button className="btn border rounded" onClick={this.onToggleReveal}>
                              Press space to show answer
                            </button>
                          )}
                      </div>
                      <ReportLink content="Report a problem" />
                    </div>
                  ) : (
                    <ReviewResults
                      index={this.state.index}
                      cards={this.state.cards}
                      numCorrect={this.state.numCorrect}
                      numIncorrect={this.state.numIncorrect}
                      cardProgress={this.state.cardProgress}
                      onKeepGoing={this.onKeepGoing}
                      onGoBack={this.onGoBack}
                    />
                  )}
                </div>
              )}
              {isCardsLoading && (
                <div className="text-center w-100">
                  <h6 className="text-center text-secondary">
                    <i className="fas fa-spinner fa-spin mr-1" />
                    Loading cards...
                  </h6>
                </div>
              )}
            </div>
            {!isCardsLoading && (
              <div className="w-100">
                <DeckFeedback deck={deck} isCompleted={this.isDeckCompleted()} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Review.defaultProps = {
  match: { params: {} },
};

export default Review;
