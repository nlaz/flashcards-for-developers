import React, { Component } from "react";

import * as api from "./apiActions";

class Review extends Component {
  state = { cards: [] };

  componentWillMount() {
    this.fetchCards();
  }

  fetchCards() {
    api.fetchCards().then(response => {
      this.setState({ cards: response });
    });
  }

  render() {
    const { cards } = this.state;
    console.log("cards", cards);

    return (
      <div className="container p-4 bg-light">
        <div>
          <h1>Review</h1>
        </div>
        <div className="row">
          <div className="col">1 of 2</div>
          <div className="col">2 of 2</div>
        </div>
      </div>
    );
  }
}

export default Review;
