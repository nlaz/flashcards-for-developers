import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "js-cookie";

import isAuthenticated from "../utils/isAuthenticated";
import SkillProgress from "../home/SkillProgress";
import DeckItem from "../home/DeckItem";
import ReviewHeatmap from "./ReviewHeatmap";
import * as api from "../apiActions";

class Profile extends Component {
  state = { pinnedDecks: [] };

  componentDidMount() {
    const { userId } = this.props.match.params;
    api.fetchUserPinnedDecks(userId).then(({ data }) => {
      this.setState({ pinnedDecks: data });
    });
  }

  isPinned = id => this.state.pinnedDecks.find(el => el.id === id);

  render() {
    const { pinnedDecks } = this.state;
    const authenticated = isAuthenticated();
    const user = authenticated ? JSON.parse(cookie.get("user")) : {};
    const decks = [];
    const studyProgress = [];

    return (
      <div>
        <div style={{ background: "#fde0d9" }}>
          <div
            className="container container--full d-flex justify-content-between align-items-center"
            style={{ height: "200px" }}
          >
            <div className="d-flex align-items-center">
              <img className="profile-image rounded" src={user.avatar_url} alt="User profile" />
              <div className="ml-3">
                <h1>{user.name}</h1>
                <button className="btn btn-sm btn-white text-uppercase d-flex align-items-center">
                  <small className="font-weight-medium">Edit</small>
                </button>
              </div>
            </div>
            <div
              className="bg-white rounded px-3 py-2 mb-2 d-flex align-items-center"
              style={{ minWidth: "260px", minHeight: "90px", border: "1px solid #d3d3d3" }}
            >
              <SkillProgress decks={decks} studyProgress={studyProgress} />
            </div>
          </div>
        </div>

        {pinnedDecks &&
          pinnedDecks.length > 0 && (
            <div className="container container--full py-4 mt-4">
              <div className="pinned-row">
                <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
                  <h6 className="text-uppercase m-0">PINNED DECKS</h6>
                  <Link className="text-dark text-underline" to="/collections/pinned">
                    See all
                  </Link>
                </div>
                <div className="row">
                  {pinnedDecks.slice(0, 4).map(item => (
                    <DeckItem
                      key={item.id}
                      deck={item}
                      isPinned={this.isPinned(item.id)}
                      deckProgress={[]}
                      onTogglePin={this.onTogglePin}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

        <div className="container container--full">
          <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
            <h6 className="text-uppercase m-0">Activity</h6>
          </div>
          <ReviewHeatmap />
        </div>

        <div className="container container--full py-4 mt-3">
          <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
            <h6 className="text-uppercase m-0">RECENT DECKS</h6>
          </div>
          <div className="row">
            {pinnedDecks.slice(0, 8).map(item => (
              <DeckItem
                key={item.id}
                deck={item}
                isPinned={this.isPinned(item.id)}
                deckProgress={[]}
                onTogglePin={this.onTogglePin}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
