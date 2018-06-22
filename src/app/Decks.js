import React, { Component } from "react";
import { Link } from "react-router-dom";

import Octicon from "../components/Octicon";

import * as api from "./apiActions";

class Decks extends Component {
  state = { category: {}, decks: [] };

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
      <div className="container p-4">
        <div className="mb-5">
          <Link to="/" className="text-dark d-flex align-items-center mb-2">
            <Octicon name="chevron-left" className="d-flex mr-1" />
            Categories
          </Link>
          <h1 className="m-0">{category.name}</h1>
          {category.description && <p>{category.description}</p>}
        </div>
        <div className="row mt-5 pt-5">
          {decks.map((deck, key) => (
            <div className="col-3 d-flex pb-2" style={{ height: "240px" }} key={key}>
              <Link
                to={`/decks/${deck.id}`}
                className="border border-dark rounded text-dark mb-4 p-4 w-100"
                style={{
                  fontSize: "14px",
                  opacity: deck.cards ? 1 : 0.25,
                }}
              >
                {deck.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Decks;
