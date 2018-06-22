import React, { Component } from "react";

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
      <div className="container p-4 bg-light">
        <div>
          <h1>Review for {deck.name}</h1>
        </div>
        <div className="row">
          {cards.map((card, key) => (
            <div className="col-12" key={key}>
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
