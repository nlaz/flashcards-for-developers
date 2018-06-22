import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
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
  state = { deck: {}, cards: [], options: [], index: 0, isWrong: false };

  componentWillMount() {
    const { params } = this.props.match;
    this.fetchDeck(params.deckId);
  }

  onClick = (answer, card) => {
    if (answer.id === card.id) {
      const { cards } = this.state;
      const index = Math.min(this.state.index + 1, cards.length - 1);
      this.setState({ index, options: this.getOptions(index, cards) });
    } else {
      this.setState({ isWrong: true }, () =>
        setTimeout(() => this.setState({ isWrong: false }), 1000),
      );
    }
  };

  checkAnswer = (answer, card) => {};

  fetchDeck = deckId => {
    api.fetchDeck(deckId).then(response => {
      this.setState({ deck: response }, () => this.fetchCards(response));
    });
  };

  fetchCards = deck => {
    const { index } = this.state;
    api.fetchCards(deck).then(response => {
      const cards = chance.shuffle(response);
      this.setState({ cards, options: this.getOptions(index, cards) });
    });
  };

  onToggle = () => this.setState(({ toggle }) => ({ toggle: !toggle }));

  getOptions = (index, cards) => {
    const random = chance.unique(chance.natural, 3, { min: 0, max: cards.length - 1 });
    const opts = chance.shuffle([...random, index]);
    return opts.map(el => cards[el]);
  };

  render() {
    const { deck, cards, options, index } = this.state;

    if (cards.length === 0) {
      return (
        <div className="container p-4">
          <h1 className="text-secondary">Loading cards...</h1>
        </div>
      );
    }

    const selected = cards[index];

    return (
      <div className="container p-4">
        <div className="mb-5">
          <Link to="/" className="text-dark d-flex align-items-center mb-2">
            <Octicon name="chevron-left" className="d-flex mr-1" />
            Back to Category
          </Link>
          <h1 className="m-0">{deck.name}</h1>
          {deck.description && <p>{deck.description}</p>}
        </div>
        <div className="row mt-5 pt-5 px-3">
          <ProgressBar index={index} length={cards.length} />
          <div
            className={cx("col-12 border border-dark rounded mb-4 py-5", {
              shake: this.state.isWrong,
            })}
          >
            <div className="row px-4">
              <div className="col-6">
                <div
                  className="text-center border rounded bg-white p-5 h-100 d-flex align-items-center justify-content-center"
                  dangerouslySetInnerHTML={{ __html: selected.front }}
                />
              </div>
              <div className="col-6">
                {options.map((option, key) => (
                  <div
                    key={key}
                    onClick={() => this.onClick(option, selected)}
                    className={cx("border rounded d-flex align-items-center p-3", {
                      "mb-2": options.length !== key + 1,
                    })}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="border rounded mr-3 px-2" style={{ fontSize: ".9em" }}>
                      {key + 1}
                    </div>
                    {option.back}
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
