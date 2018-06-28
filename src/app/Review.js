import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import marked from "marked";
import Chance from "chance";
import injectSheet from "react-jss";
import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip, Legend } from "recharts";

import Octicon from "../components/Octicon";
import * as api from "./apiActions";
import * as analytics from "../components/GoogleAnalytics";
import "./Review.css";

const chance = new Chance();
const MAX_DECK_SIZE = 12;
const SELF_GRADE_CORRECT = "I was right";
const SELF_GRADE_INCORRECT = "I was wrong";

const styles = {
  progressBar: {
    height: 10,
    borderRadius: "999px",
    background: "#eeeeee",
  },
  progress: {
    height: 10,
    borderRadius: "999px",
  },
};

const ProgressBar = injectSheet(styles)(({ classes, index, length }) => (
  <div className={cx(classes.progressBar, "w-100 mb-3")}>
    <div
      className={cx(classes.progress, "bg-dark")}
      style={{ width: 100 * index / length + "%" }}
    />
  </div>
));

const initialState = {
  deck: {},
  cards: [],
  options: [],
  index: 0,
  isWrong: false,
  isLoading: true,
  isError: false,
  isReversed: false,
  isFinished: false,
  isRevealed: false,
  numCorrect: 0,
  numIncorrect: 0,
  selected: {},
};

class Review extends Component {
  state = { ...initialState };

  componentWillMount() {
    const { params } = this.props.match;
    this.fetchDeck(params.deckId);
  }

  componentDidMount() {
    window.addEventListener("keyup", e => this.onKeyPress(e));
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", e => this.onKeyPress(e));
    clearTimeout(this.timeout);
  }

  onSelect = (answer, card) => {
    this.setState({ selected: answer });
    if (this.isSelfGraded()) {
      if (this.state.isRevealed) {
        analytics.logReviewEvent(card.id);
        if (answer === SELF_GRADE_INCORRECT) {
          this.setState({
            numCorrect: this.state.numCorrect - 1,
            numIncorrect: this.state.numIncorrect + 1,
          });
        }
        this.timeout = setTimeout(() => {
          this.onCorrectAnswer();
          this.onToggleReveal();
        }, 300);
      } else {
        this.onToggleReveal();
      }
    } else if (this.isCorrect(answer, card)) {
      analytics.logReviewEvent(card.id);
      this.timeout = setTimeout(() => this.onCorrectAnswer(), 300);
    } else {
      this.onIncorrectAnswer(card);
    }
  };

  onKeyPress = e => {
    if (!this.isFinished()) {
      const { options } = this.state;
      if (options.map((i, k) => String(k + 1)).includes(e.key)) {
        const answer = parseInt(e.key, 10) - 1;
        const { options } = this.state;
        const currentCard = this.getCurrentCard();
        this.onSelect(options[answer], currentCard);
      }
    }
  };

  onCorrectAnswer = () => {
    const { cards } = this.state;
    const index = Math.min(this.state.index + 1, cards.length);
    const isReversed = this.isReversible(this.state.deck) && chance.bool();
    const isFinished = this.isFinished(index, cards);
    const options = this.getOptions(index, cards);
    const numCorrect = this.state.numCorrect + 1;
    if (isFinished) {
      analytics.logFinishedEvent(this.state.deck.id);
    }
    this.setState({
      index,
      options,
      isReversed,
      isFinished,
      numCorrect,
      selected: {},
    });
  };

  onIncorrectAnswer = card => {
    const numIncorrect = this.state.numIncorrect + 1;
    this.setState({ isWrong: true, numIncorrect }, () =>
      setTimeout(() => this.setState({ isWrong: false }), 500),
    );
  };

  onToggleReveal = () => {
    this.setState({ isRevealed: !this.state.isRevealed }, () =>
      this.setState({
        options: this.getOptions(this.state.index, this.state.cards),
      }),
    );
  };

  onReset = () => {
    const { deck } = this.state;
    analytics.logReviewAgainEvent(deck.id);
    this.setState({ ...initialState, deck }, () => this.fetchCards(deck));
  };

  fetchDeck = deckId => {
    api.fetchDeck(deckId).then(
      response => {
        this.setState({ deck: response }, () => this.fetchCards(response));
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
  };

  fetchCards = deck => {
    const { index } = this.state;
    api.fetchCards(deck).then(
      response => {
        const maxSize = Math.min(response.length - 1, MAX_DECK_SIZE);
        const cards = chance.shuffle(response).splice(0, maxSize);
        this.setState({ cards, options: this.getOptions(index, cards), isLoading: false });
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
  };

  getOptions = (index, cards) => {
    if (this.isSelfGraded()) {
      if (this.state.isRevealed) {
        return [SELF_GRADE_CORRECT, SELF_GRADE_INCORRECT];
      } else {
        return ["Show answer"];
      }
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
  getCardHTML = card => {
    if (this.isSelfGraded()) {
      return marked(this.state.isRevealed ? card.back : card.front);
    } else {
      return marked(this.state.isReversed ? card.back : card.front);
    }
  };
  getResults = () => [
    { name: "Correct", value: this.state.numCorrect },
    { name: "Incorrect", value: this.state.numIncorrect },
  ];

  isReversible = deck => (deck || this.state.deck).type === "Reversible select";
  isMultiple = deck => (deck || this.state.deck).type === "Multiple select";
  isSelfGraded = deck => (deck || this.state.deck).type === "Self graded";
  isImageSelect = deck => (deck || this.state.deck).type === "Image select";
  isFinished = index => (index || this.state.index) >= this.state.cards.length;
  isCorrect = (option, card) =>
    this.isMultiple() ? option.back === card.back : option.id === card.id || this.isSelfGraded();
  isSelected = option =>
    option.id ? this.state.selected.id === option.id : this.state.selected === option;

  render() {
    const { deck, cards, options, index, isLoading, isError, isFinished } = this.state;

    if (isLoading) {
      return (
        <div className="container p-4">
          <h1 className="text-secondary">Loading deck...</h1>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="container p-4">
          <Link to="/" className="text-dark d-flex align-items-center mb-2">
            <Octicon name="chevron-left" className="d-flex mr-1" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-dark">Unable to load request</h1>
            <p>Please try again or go back home.</p>
          </div>
        </div>
      );
    }

    const currentCard = this.getCurrentCard();
    const results = this.getResults();

    return (
      <div className="container p-4">
        <div className="mb-5">
          <Link
            to={this.getCategoryUrl(deck.category)}
            className="text-dark d-flex align-items-center mb-2"
          >
            <Octicon name="chevron-left" className="d-flex mr-1" />
            Back to Category
          </Link>
          <h1 className="m-0">{deck.name}</h1>
          {deck.description && <p>{deck.description}</p>}
          {deck.difficulty &&
            deck.difficulty.map((level, key) => (
              <span className="badge badge-pill badge-dark mr-1" key={key}>
                {level}
              </span>
            ))}
        </div>
        <div className="row mt-5 pt-4 px-3">
          <span
            className="small text-secondary text-right w-100 mb-1 mr-1"
            style={{ opacity: 0.5 }}
          >
            {index} / {cards.length}
          </span>
          <ProgressBar index={index} length={cards.length} />
          <div
            style={{ minHeight: "400px" }}
            className={cx(
              "col-12 border border-dark rounded mb-4 py-5 d-flex align-items-stretch",
              {
                shake: this.state.isWrong,
              },
            )}
          >
            {!isFinished ? (
              <div className="row w-100 mx-0">
                {deck.type && (
                  <div
                    className="badge badge-pill badge-light text-secondary position-absolute mr-4"
                    style={{ top: "12px", right: "0" }}
                  >
                    {this.getDeckType()}
                  </div>
                )}
                <div className="col-12 col-lg-6 d-flex align-items-center">
                  {this.isImageSelect(deck) ? (
                    <img className="img-fluid px-3 mx-auto" alt="" src={currentCard.front} />
                  ) : (
                    <div
                      className="flashcard-body markdown-body text-left border rounded bg-white px-3 py-5 h-100 d-flex align-items-stretch justify-content-center w-100"
                      dangerouslySetInnerHTML={{
                        __html: this.getCardHTML(currentCard),
                      }}
                    />
                  )}
                </div>
                <div className="col-12 col-lg-6 d-flex flex-column align-items-stretch">
                  {options.map((option, key) => (
                    <div
                      key={option.id || option}
                      style={{ cursor: "pointer" }}
                      onClick={() => this.onSelect(option, currentCard)}
                      className={cx("border rounded d-flex align-items-start p-3 w-100", {
                        "mb-2": options.length !== key + 1,
                        "border-success text-success":
                          this.isSelected(option) && this.isCorrect(option, currentCard),
                        "border-danger text-danger":
                          this.isSelected(option) && !this.isCorrect(option, currentCard),
                      })}
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
                </div>
              </div>
            ) : (
              <div className="w-100">
                <h3 className="mb-5 text-center">You're done!</h3>
                <div className="row d-flex mb-5">
                  <div className="px-5" style={{ width: "50%" }}>
                    <ResponsiveContainer height={200} width="100%" className="px-4">
                      <PieChart>
                        <Pie
                          data={results}
                          dataKey="value"
                          innerRadius={40}
                          outerRadius={80}
                          animationDuration={500}
                          fill="#82ca9d"
                        >
                          <Cell fill="#343a40" />
                          <Cell fill="#6c757d" />
                        </Pie>
                        <Legend verticalAlign="top" align="right" layout="vertical" />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
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
                          <td>Missed Cards</td>
                          <td>{this.state.numIncorrect}</td>
                        </tr>
                        <tr>
                          <td>Correct Cards</td>
                          <td>{this.state.numCorrect}</td>
                        </tr>
                        <tr>
                          <td>Total Seen</td>
                          <td>{this.state.cards.length}</td>
                        </tr>
                      </tbody>
                    </table>
                    <button className="btn btn-dark ml-auto" onClick={this.onReset}>
                      Again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Review;
