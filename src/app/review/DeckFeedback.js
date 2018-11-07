import React, { Component } from "react";
import cx from "classnames";
import PropTypes from "prop-types";

import * as analytics from "../../components/GoogleAnalytics";
import config from "../../config/index";

class DeckFeedback extends Component {
  state = { isVoteSent: false };

  componentDidMount() {
    this.context.mixpanel.track("Finished Deck.");
  }

  onVote = value => {
    const { deck } = this.props;
    this.setState({ isVoteSent: true });
    analytics.logDeckFeedback(value, deck.id);
  };

  render() {
    return (
      <div className={cx("deck-vote w-100", { "deck-vote--active": this.props.isCompleted })}>
        <div className="bg-light border border-secondary rounded text-center p-2">
          {!this.state.isVoteSent ? (
            <div>
              <p className="font-weight-medium mb-2">Was this deck helpful?</p>
              <div className="vote-options">
                <div onClick={() => this.onVote("😞")}>
                  <span role="img" aria-label="Sad">
                    😞
                  </span>
                </div>
                <div onClick={() => this.onVote("😐")}>
                  <span role="img" aria-label="Neutral">
                    😐
                  </span>
                </div>
                <div onClick={() => this.onVote("😄")}>
                  <span role="img" aria-label="Happy">
                    😄
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-weight-medium my-2">
                Your feedback will improve our content! Thank you!{" "}
                <span role="img" aria-label="Tada!">
                  🎉
                </span>
                <a
                  className="font-weight-normal text-muted text-underline line ml-1"
                  rel="noopener noreferrer"
                  href={config.airtableFeedbackUrl}
                >
                  Leave a comment...
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

DeckFeedback.contextTypes = {
  mixpanel: PropTypes.object.isRequired,
};
export default DeckFeedback;
