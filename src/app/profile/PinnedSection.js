import React, { Component } from "react";
import { Link } from "react-router-dom";

import * as analytics from "../../components/GoogleAnalytics";

import Octicon from "../../components/Octicon";
import DeckItem from "../home/DeckItem";

class PinnedSection extends Component {
  isPinned = id => this.props.pinnedDecks.find(el => el.id === id);
  getDeckProgress = id => this.props.studyProgress.find(el => el.deck === id);

  render() {
    const { pinnedDecks } = this.props;
    return (
      <div className="container container--full my-4">
        <div className="d-flex justify-content-between align-items-end">
          <h6 className="text-uppercase mb-1 mx-1">PINNED DECKS</h6>
          <Link
            className="btn btn-dark btn-sm text-white d-flex px-2"
            onClick={() => analytics.logUserAction("Clicked 'Study now' button")}
            to="/collections/pinned/review"
          >
            <Octicon name="rocket" fill="white" className="d-flex align-items-center mr-1" />
            <span className="ml-1">Study Now</span>
          </Link>
        </div>
        <hr className="mt-1 mb-3" />
        {pinnedDecks.length > 0 ? (
          <div className="row">
            {pinnedDecks.map(item => (
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

            <h1 className="m-0">No pinned decks</h1>
            <p className="mx-auto" style={{ maxWidth: "500px" }}>
              If you encounter a deck that you want to return to, just click the 'Pin' button and it
              will appear here.
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default PinnedSection;
