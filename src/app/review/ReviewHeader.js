import React from "react";
import marked from "marked";
import cx from "classnames";
import { withRouter } from "react-router-dom";

import Octicon from "../../components/Octicon";
import isAuthenticated from "../utils/isAuthenticated";
import * as analytics from "../../components/GoogleAnalytics";
import * as api from "../apiActions";

import LoginModal from "../auth/LoginModal";

class ReviewHeader extends React.Component {
  state = { showModal: false, pinnedDecks: [] };

  componentDidMount() {
    if (isAuthenticated()) {
      this.fetchPinnedDecks();
    }
  }

  onCloseModal = () => {
    analytics.logLoginAction("User exited login modal");
    this.setState({ showModal: false });
  };

  onTogglePin = () => {
    const { deck } = this.props;
    if (!isAuthenticated()) {
      this.setState({ showModal: true });
    } else {
      const isPinned = this.isPinned(deck.id);
      analytics.logPinDeckAction(deck.name, isPinned);

      api
        .togglePinnedDeck(deck.id, isPinned)
        .then(response => this.setState({ pinnedDecks: response.data }))
        .catch(this.handleError);
    }
  };

  fetchPinnedDecks = () => {
    api.fetchPinnedDecks().then(({ data }) => {
      this.setState({ pinnedDecks: data });
    });
  };

  isPinned = id => this.state.pinnedDecks.find(el => el.id === id);
  isCollectionPage = () => this.props.match.path === "/collections/:collectionId/review";

  render() {
    const { deck, className } = this.props;
    const isPinned = this.isPinned(deck.id);
    return (
      <div className={className}>
        <LoginModal isOpen={this.state.showModal} onClose={this.onCloseModal} />
        <h1 className="m-0">{deck.name}</h1>
        {deck.description && (
          <div
            className="deck-description"
            dangerouslySetInnerHTML={{
              __html: marked(deck.description),
            }}
          />
        )}
        {deck.source && (
          <div className="mb-3 d-flex align-items-center">
            <Octicon name="link" className="d-flex mr-1" />
            <a
              className="truncate"
              rel="noopener noreferrer"
              style={{ fontSize: ".9em" }}
              href={deck.source}
            >
              {deck.source}
            </a>
          </div>
        )}
        {!this.isCollectionPage() && (
          <button
            onClick={this.onTogglePin}
            className={cx("pin-btn btn btn-sm d-flex align-items-center px-3 py-2", {
              "bg-dark text-white": isPinned,
            })}
          >
            <Octicon name={isPinned ? "check" : "pin"} className="d-flex mr-2" />
            <small className="font-weight-bold mr-1">{isPinned ? "PINNED" : "PIN"}</small>
          </button>
        )}
      </div>
    );
  }
}

export default withRouter(ReviewHeader);
