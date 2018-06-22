import React, { Component } from "react";
import { Link } from "react-router-dom";

import * as api from "./apiActions";

class Decks extends Component {
  state = { category: {}, decks: {} };

  componentWillMount() {
    const { params } = this.props.match;
    this.fetchCategory(params.categoryId);
  }

  fetchCategory = categoryId => {
    api.fetchCategory(categoryId).then(response => {
      this.setState({ category: response }, () => this.fetchDecks(response));
    });
  };

  fetchDecks = category => {
    api.fetchDecks(category).then(response => {
      this.setState({ decks: response });
    });
  };

  render() {
    const { category, decks } = this.state;

    return (
      <div className="container p-4 bg-light">
        <div>
          <h1>{category.name} Decks</h1>
        </div>
        <div className="row">
          {Object.keys(decks).map((id, key) => (
            <div className="col-3 d-flex" key={key}>
              <Link to={`/decks/${id}`} className="bg-dark text-light mb-4 p-4 w-100">
                {decks[id]}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Decks;
