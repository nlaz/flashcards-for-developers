import React, { Component } from "react";
import cx from "classnames";

import * as api from "../apiActions";
import Octicon from "../../components/Octicon";

class DeckFeedback extends Component {
  state = { isVoteSent: false };

  onUpVote = () => {
    const { deck } = this.props;
    this.setState({ isVoteSent: true });
    api.updateDeck(deck.id, { Upvotes: (deck.upvotes || 0) + 1 }).then(response => {
      this.setState({ deck: response });
    });
  };

  onDownVote = () => {
    const { deck } = this.props;
    this.setState({ isVoteSent: true });
    api.updateDeck(deck.id, { Downvotes: (deck.downvotes || 0) + 1 }).then(response => {
      this.setState({ deck: response });
    });
  };

  render() {
    return (
      <div className={cx("deck-vote w-100", { "deck-vote--active": this.props.isCompleted })}>
        <div className="bg-light border border-secondary rounded text-center p-2">
          {!this.state.isVoteSent ? (
            <div>
              <p className="font-weight-medium mb-2">Was this deck helpful?</p>
              <div>
                <button
                  className="btn btn-outline-dark bg-white px-5 py-2 mr-2"
                  onClick={this.onDownVote}
                  aria-label="No"
                >
                  <Octicon className="d-flex" name="thumbsdown" />
                </button>
                <button
                  className="btn btn-outline-dark bg-white px-5 py-2"
                  onClick={this.onUpVote}
                  aria-label="Yes"
                >
                  <Octicon className="d-flex" name="thumbsup" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-weight-medium my-2">
                Your feedback will improve our content! Thank you!{" "}
                <span role="img" aria-label="Tada!">
                  🎉
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DeckFeedback;
