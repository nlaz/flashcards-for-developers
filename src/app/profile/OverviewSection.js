import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "js-cookie";

import isAuthenticated from "../utils/isAuthenticated";
import ReviewHeatmap from "./ReviewHeatmap";
import DeckItem from "../home/DeckItem";

class OverviewSection extends Component {
  isPinned = id => this.props.pinnedDecks.find(el => el.id === id);
  getDeckProgress = id => this.props.studyProgress.find(el => el.deck === id);

  render() {
    const { pinnedDecks } = this.props;
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};

    return (
      <div className="">
        <div className="container container--full my-4">
          <div className="pinned-row">
            <div className="d-flex justify-content-between align-items-end mb-1 mx-1 pt-1">
              <h6 className="text-uppercase m-0">PINNED DECKS</h6>
              <Link className="text-dark text-underline" to={`/${user.id}/pinned`}>
                See all
              </Link>
            </div>
            <hr className="mt-1 mb-3" />
            {pinnedDecks.length > 0 ? (
              <div className="row">
                {pinnedDecks.slice(0, 4).map(item => (
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
              <div className="blankslate py-4 my-2">
                <div className="font-weight-bold" style={{ fontSize: "14px" }}>
                  You haven't pinned any decks yet.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="container container--full my-4">
          <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
            <h6 className="text-uppercase m-0">Activity</h6>
          </div>
          <ReviewHeatmap />
        </div>
      </div>
    );
  }
}

export default OverviewSection;
