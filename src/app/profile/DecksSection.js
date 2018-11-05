import React, { Component } from "react";
import { Link } from "react-router-dom";

import Octicon from "../../components/Octicon";
import DeckItem from "../home/DeckItem";

class DecksSection extends Component {
  isPinned = id => this.props.pinnedDecks.find(el => el.id === id);
  getDeckProgress = id => this.props.studyProgress.find(el => el.deck === id);

  render() {
    const { decks } = this.props;

    return (
      <div className="container container--full my-4">
        <div className="d-flex justify-content-between align-items-end">
          <h6 className="text-uppercase mb-1 mx-1">DECKS</h6>
          <Link to="/decks/new" className="btn btn-success btn-sm text-white">
            + Add Deck
          </Link>
        </div>
        <hr className="mt-1 mb-3" />
        {decks.length > 0 ? (
          <div className="row">
            {decks.map(item => (
              <DeckItem
                key={item.id}
                deck={item}
                isPinned={this.isPinned(item.id)}
                deckProgress={this.getDeckProgress(item.id)}
                onTogglePin={this.props.onTogglePin}
              />
            ))}
          </div>
        ) : (
          <div className="blankslate py-5 my-2">
            <Octicon name="note" height="32" fill="#99a0a8" className="mx-2" />
            <Octicon name="package" height="32" fill="#99a0a8" className="mx-2" />
            <Octicon name="graph" height="32" fill="#99a0a8" className="mx-2" />

            <h1 className="m-0">No decks yet</h1>
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
