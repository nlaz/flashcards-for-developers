import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import marked from "marked";
import Chance from "chance";
import moment from "moment";
import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip, Legend, Label } from "recharts";

import config from "../../config";
import Octicon from "../../components/Octicon";
import DeckFeedback from "./DeckFeedback";
import ReviewHeader from "./ReviewHeader";
import StudyProgress from "./StudyProgress";
import * as api from "../apiActions";
import * as analytics from "../../components/GoogleAnalytics";
import "./Review.css";

const chance = new Chance();
const PAGE_SIZE = 8;
const SELF_GRADE_CORRECT = "I was right";
const SELF_GRADE_INCORRECT = "I was wrong";

const getRandomPageSize = () => chance.integer({ min: PAGE_SIZE - 2, max: PAGE_SIZE + 1 });

const ReviewNavigation = ({ location }) => (
  <div className="navbar">
    <Link
      to={{ pathname: "/", search: location.search }}
      className="py-2 d-flex align-items-center font-weight-medium text-dark"
    >
      <Octicon name="chevron-left" className="d-flex mr-1" />
      Flashcards for Developers
    </Link>
  </div>
);

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
    options: [],
    index: 0,
    isWrong: false,
    isLoading: true,
    isError: false,
    isReversed: false,
    isRevealed: false,
    numCorrect: 0,
    numIncorrect: 0,
    selected: {},
    pageSize: getRandomPageSize(),
    page: 0,
  };

  componentDidMount() {
    const { params } = this.props.match;
    this.fetchDeck(params.deckId);
    window.addEventListener("keyup", e => this.onKeyPress(e));
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", e => this.onKeyPress(e));
    clearTimeout(this.timeout);
  }

  onKeyPress = e => {
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

  onOptionPress = key => {
    const index = parseInt(key, 10) - 1;
    const answer = this.state.options[index];
    this.onSelectAnswer(answer);
  };

  onSpaceBarPress = () => {
    if (this.isStageFinished()) {
      this.onKeepGoing();
    } else if (this.isSelfGraded() && !this.state.isRevealed) {
      this.onToggleReveal();
    }
  };

  onSelectAnswer = answer => {
    const isSelfGraded = this.isSelfGraded();

    this.setState({ selected: answer });
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

  handleSelfGradedAnswer = answer => {
    const isCorrect = answer === SELF_GRADE_CORRECT;

    if (!this.state.isRevealed) {
      return;
    }
    if (!isCorrect) {
      const numCorrect = this.state.numCorrect - 1;
      const numIncorrect = this.state.numIncorrect + 1;
      this.setState({ numCorrect, numIncorrect });
    }

    this.timeout = setTimeout(() => this.handleCorrectAnswer(), 300);
  };

  handleMultipleChoiceAnswer = answer => {
    const card = this.getCurrentCard();
    const isCorrect = this.isCorrectAnswer(answer, card);

    if (isCorrect) {
      this.timeout = setTimeout(() => this.handleCorrectAnswer(), 300);
    } else {
      this.handleIncorrectAnswer(card);
    }
  };

  handleCorrectAnswer = () => {
    const { cards } = this.state;
    const index = Math.min(this.state.index + 1, cards.length);
    if (this.isStageFinished(index)) {
      this.logReviewEvent();
      this.handleSaveProgress(index);
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

  handleSaveProgress = index => {
    const progressObj = {
      progress: this.getProgress(index) / 100,
      reviewedAt: moment(),
      leitnerBox: 1, //TODO increment/decrement leitner box
    };
    localStorage.setItem(this.state.deck.id, JSON.stringify(progressObj));
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
      response => {
        document.title = response.name
          ? `${response.name} Flashcards`
          : "Flashcards for Developers";
        this.setState({ deck: response }, () => this.fetchCards(response));
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
  };

  fetchCards = deck => {
    const { index } = this.state;
    api.fetchCards(deck).then(
      response => {
        const cards = chance.shuffle(response);
        const options = this.getOptions(index, cards);
        this.setState({ cards, options, isLoading: false });
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
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

  getProgress = index => Math.round(100 * (index || this.state.index) / this.state.cards.length);
  getPageStart = () => Math.max(Math.floor(this.state.page * this.state.pageSize), 0);
  getPageEnd = () =>
    Math.min(Math.floor((this.state.page + 1) * this.state.pageSize), this.state.cards.length);

  getResults = () => [
    { name: "Correct", value: this.state.numCorrect },
    { name: "Incorrect", value: this.state.numIncorrect },
  ];
  getProgressData = () => [
    { name: "Practiced", value: this.state.index },
    { name: "Not started", value: this.state.cards.length - this.state.index },
  ];

  isReversible = deck => (deck || this.state.deck).type === "Reversible select";
  isMultiple = deck => (deck || this.state.deck).type === "Multiple select";
  isSelfGraded = deck => (deck || this.state.deck).type === "Self graded";
  isImageSelect = deck => (deck || this.state.deck).type === "Image select";
  isStageFinished = index =>
    (index || this.state.index) >= Math.min(this.getPageEnd(), this.state.cards.length);
  isDeckCompleted = index => (index || this.state.index) > this.state.cards.length - 1;
  isCorrectAnswer = (option, card) =>
    this.isMultiple() ? option.back === card.back : option.id === card.id || this.isSelfGraded();
  isSelected = option =>
    option.id ? this.state.selected.id === option.id : this.state.selected === option;

  render() {
    const { deck, options, index, isLoading, isError } = this.state;

    if (isLoading) {
      return (
        <div className="container container--narrow px-0">
          <ReviewNavigation location={this.props.location} />
          <div className="p-4">
            <h1 className="text-secondary">Loading deck...</h1>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="container container--narrow px-0">
          <ReviewNavigation location={this.props.location} />
          <div className="text-center p-4">
            <h1 className="text-dark">Unable to load request</h1>
            <p>Please try again or go back home.</p>
          </div>
        </div>
      );
    }

    const currentCard = this.getCurrentCard();
    const progressData = this.getProgressData();
    const progress = this.getProgress();
    const pageEnd = this.getPageEnd();
    const pageStart = this.getPageStart();
    const isStageFinished = this.isStageFinished();
    const isCompleted = this.state.index > this.state.cards.length - 1;

    return (
      <div>
        <div className="container container--narrow px-0">
          <ReviewNavigation location={this.props.location} />
        </div>
        <div className="container container--narrow py-4">
          <ReviewHeader deck={deck} className="mb-5" />
          <div className="flashcard-container row mt-4 px-3">
            <StudyProgress
              className="mt-2"
              index={index}
              items={this.state.cards}
              pageSize={this.state.pageSize}
              pageEnd={pageEnd}
              pageStart={pageStart}
              isFinished={isStageFinished}
            />
            <div
              style={{ minHeight: "400px" }}
              className={cx(
                "col-12 border border-dark rounded mb-4 py-5 d-flex align-items-stretch",
                {
                  shake: this.state.isWrong,
                },
              )}
            >
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
                              this.isSelected(option) && this.isCorrectAnswer(option, currentCard),
                            "border-danger text-danger":
                              this.isSelected(option) && !this.isCorrectAnswer(option, currentCard),
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
                <div className="w-100">
                  <h3 className="mb-5 text-center">
                    {this.state.index <= this.state.cards.length - 1
                      ? "Nice work!"
                      : "You're done!"}
                  </h3>
                  <div className="row d-flex mb-2">
                    <div className="px-5 position-relative col-12 col-lg-6">
                      <ResponsiveContainer height={200} width="100%">
                        <PieChart>
                          <Pie
                            data={progressData}
                            dataKey="value"
                            innerRadius={60}
                            outerRadius={80}
                            animationDuration={0}
                            startAngle={180}
                            endAngle={0}
                            fill="#82ca9d"
                          >
                            <Cell fill="#343a40" />
                            <Cell fill="#efefef" />
                            <Label
                              className="font-weight-bold"
                              fill="#343a40"
                              position="center"
                              style={{ fontSize: "24px" }}
                              value={`${progress}%`}
                            />
                          </Pie>
                          <Legend className="w-100" verticalAlign="top" height={50} />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <span
                        className="text-center font-weight-medium position-absolute"
                        style={{ right: 0, left: 0, top: "135px" }}
                      >
                        Progress
                      </span>
                    </div>
                    <div className="px-4" style={{ flexGrow: 1 }}>
                      <table className="table w-100">
                        <thead>
                          <tr>
                            <th>Results</th>
                            <th>#</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Incorrect Answers</td>
                            <td>{this.state.numIncorrect}</td>
                          </tr>
                          <tr>
                            <td>Correct Answers</td>
                            <td>{this.state.numCorrect}</td>
                          </tr>
                          <tr>
                            <td>Total Seen</td>
                            <td>{this.state.index}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    {!isCompleted ? (
                      <div>
                        <Link
                          to={{ pathname: "/", search: this.props.location.search }}
                          className="btn btn-outline-dark mr-2"
                        >
                          Go back
                        </Link>
                        <button className="btn btn-dark" onClick={this.onKeepGoing}>
                          Press space to continue
                        </button>
                      </div>
                    ) : (
                      <Link
                        to={{ pathname: "/", search: this.props.location.search }}
                        className="btn btn-dark"
                      >
                        Go back home
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="w-100">
              <DeckFeedback deck={deck} isCompleted={this.isDeckCompleted()} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Review;
