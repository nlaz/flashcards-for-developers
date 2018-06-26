import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import marked from "marked";
import Chance from "chance";
import injectSheet from "react-jss";

import Octicon from "../components/Octicon";
import * as api from "./apiActions";
import "./Review.css";

const chance = new Chance();

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
      style={{ width: 100 * (index + 1) / length + "%" }}
    />
  </div>
));

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
  };

  componentWillMount() {
    const { params } = this.props.match;
    this.fetchDeck(params.deckId);
  }

  onClick = (answer, card) => {
    if (answer.id === card.id) {
      const { cards } = this.state;
      const index = Math.min(this.state.index + 1, cards.length - 1);
      const isReversed = this.isReversible(this.state.deck) && chance.bool();
      this.setState({ index, options: this.getOptions(index, cards), isReversed });
    } else {
      this.setState({ isWrong: true }, () =>
        setTimeout(() => this.setState({ isWrong: false }), 500),
      );
    }
  };

  checkAnswer = (answer, card) => {};

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
        const maxSize = Math.min(response.length - 1, 30);
        const cards = chance.shuffle(response).splice(0, maxSize);
        this.setState({ cards, options: this.getOptions(index, cards), isLoading: false });
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
  };

  onToggle = () => this.setState(({ toggle }) => ({ toggle: !toggle }));

  getOptions = (index, cards) => {
    const random = chance.unique(chance.natural, Math.min(3, cards.length), {
      min: 0,
      max: cards.length - 1,
    });
    const uniqOptions = [...new Set([...random, index])];
    const opts = chance.shuffle(uniqOptions);
    return opts.map(el => cards[el]);
  };

  getCategoryUrl = id => `/categories/${id}`;

  isReversible = deck => deck.type === "Reversible select";
  isImageSelect = deck => deck.type === "Image select";

  render() {
    const { deck, cards, options, index, isLoading, isError, isReversed } = this.state;

    if (isLoading) {
      return (
        <div className="container p-4">
          <h1 className="text-secondary">Loading cards...</h1>
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

    const selected = cards[index];

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
        <div className="row mt-5 pt-5 px-3">
          <ProgressBar index={index} length={cards.length} />
          <div
            className={cx("col-12 border border-dark rounded mb-4 py-5 d-flex align-items-center", {
              shake: this.state.isWrong,
            })}
            style={{ minHeight: "400px" }}
          >
            <div className="row px-4 w-100">
              <div className="col-6 d-flex align-items-center">
                {this.isImageSelect(deck) ? (
                  <img className="img-fluid px-3 mx-auto" alt="" src={selected.front} />
                ) : (
                  <div
                    className="markdown-body text-left border rounded bg-white px-3 py-5 h-100 d-flex align-items-center justify-content-center w-100"
                    dangerouslySetInnerHTML={{
                      __html: marked(isReversed ? selected.back : selected.front),
                    }}
                  />
                )}
              </div>
              <div className="col-6 d-flex flex-column align-items-center justify-content-center">
                {options.map((option, key) => (
                  <div
                    key={key}
                    onClick={() => this.onClick(option, selected)}
                    className={cx("border rounded d-flex align-items-center p-3 w-100", {
                      "mb-2": options.length !== key + 1,
                    })}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="border rounded mr-3 px-2" style={{ fontSize: ".9em" }}>
                      {key + 1}
                    </div>
                    <div
                      className="markdown-body text-left bg-white"
                      dangerouslySetInnerHTML={{
                        __html: marked(isReversed ? option.front : option.back),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Review;
