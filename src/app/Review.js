import React, { Component } from "react";
import { Link } from "react-router-dom";

import Octicon from "../components/Octicon";

import * as api from "./apiActions";

class Review extends Component {
  state = { deck: {}, cards: [] };

  componentWillMount() {
    const { params } = this.props.match;
    this.fetchDeck(params.deckId);
  }

  fetchDeck = deckId => {
    api.fetchDeck(deckId).then(response => {
      this.setState({ deck: response }, () => this.fetchCards(response));
    });
  };

  fetchCards = deck => {
    api.fetchCards(deck).then(response => {
      this.setState({ cards: response });
    });
  };

  render() {
    const { deck, cards } = this.state;

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
        <div className="row mt-5 pt-5">
          {cards.map((card, key) => (
            <div className="col-12 border border-dark rounded mb-4 py-5" key={key}>
              <div
                className="text-center bg-white m-3 p-5"
                dangerouslySetInnerHTML={{ __html: card.front }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Review;
