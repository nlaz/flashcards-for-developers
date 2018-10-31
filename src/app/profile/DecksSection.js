import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import * as api from "../apiActions";
import Octicon from "../../components/Octicon";
import DeckItem from "../home/DeckItem";

class DecksSection extends Component {
  state = { decks: [], isRedirect: false };

  componentDidMount() {
    this.fetchDecksForUser();
  }

  fetchDecksForUser = () => {
    api
      .fetchDecksForUser()
      .then(response => this.setState({ decks: response.data }))
      .catch(error => console.error(error));
  };

  isPinned = id => this.props.pinnedDecks.find(el => el.id === id);
  getDeckProgress = id => this.props.studyProgress.find(el => el.deck === id);

  render() {
    const { decks, isRedirect } = this.state;

    if (isRedirect) {
      return <Redirect to="/" />;
    }

    return (
      <div className="container container--full px-4 my-5">
        {decks.length > 0 ? (
          <div className="row">
            {decks.map(item => (
              <DeckItem
                key={item.id}
                deck={item}
                isPinned={this.isPinned(item.id)}
                deckProgress={this.getDeckProgress(item.id)}
                onTogglePin={this.onTogglePin}
              />
            ))}
          </div>
        ) : (
          <div className="blankslate py-5 my-2">
            <Octicon name="note" height="32" fill="#99a0a8" className="mx-2" />
            <Octicon name="package" height="32" fill="#99a0a8" className="mx-2" />
            <Octicon name="graph" height="32" fill="#99a0a8" className="mx-2" />

            <h1 className="m-0">No current decks</h1>
            <p>You don't have any flashcard decks yet. Add a few decks to get started.</p>
            <Link to="/decks/new" className="btn btn-success btn-sm text-white px-3">
              + Add Deck
            </Link>
          </div>
        )}
      </div>
    );
  }
}
export default DecksSection;
