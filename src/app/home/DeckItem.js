import React, { Component } from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import * as utils from "../utils/studyProgress";
import ProgressBar from "../../components/ProgressBar";
import Octicon from "../../components/Octicon";

import isProMember from "../utils/isProMember";
import UpgradeModal from "../auth/UpgradeModal";

import * as analytics from "../../components/GoogleAnalytics";

class DeckItem extends Component {
  state = { showUpgradeModal: false };

  onOpenUpgradeModal = e => {
    e.preventDefault();
    this.setState({ showUpgradeModal: true });
  };

  onCloseUpgradeModal = () => {
    analytics.logProAction("User exited upgrade modal from 'Deck Item'");
    this.setState({ showUpgradeModal: false });
  };

  onClick = e => {
    if (this.props.deck.pro && !isProMember()) {
      e.preventDefault();
      this.onOpenUpgradeModal(e);
    } else if (this.props.deck.pro && isProMember()) {
      analytics.logProAction("User successfully clicked a 'Pro' level deck button");
    }
  };

  render() {
    const progress = utils.calcStudyProgress(this.props.deck, this.props.deckProgress);
    const proficiency = utils.calcStudyProficiency(this.props.deckProgress);
    const label = this.props.isPinned ? "Pinned" : "Pin";

    return (
      <div className="deck-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
        <UpgradeModal isOpen={this.state.showUpgradeModal} onClose={this.onCloseUpgradeModal} />

        <Link
          onClick={this.onClick}
          to={`/decks/${this.props.deck.id}`}
          className={cx(
            "border bg-white rounded d-flex flex-column justify-content-between text-dark mb-3 p-4 w-100 position-relative",
            this.props.deck.new ? "border-dark" : "border-dark",
          )}
          disabled={!this.props.deck.cards}
          style={{
            fontSize: "14px",
            opacity: this.props.deck.cards ? 1 : 0.25,
          }}
        >
          <div>
            <ProgressBar className="mb-2" progress={progress} proficiency={proficiency} />
            {this.props.deck.name}
            <button
              className={cx(
                "pin-btn badge position-absolute align-items-center p-1 text-uppercase",
                {
                  "pin-btn-active bg-dark text-white": this.props.isPinned,
                },
              )}
              style={{ bottom: "16px", left: "18px" }}
              onClick={e => this.props.onTogglePin(e, this.props.deck)}
            >
              <Octicon
                name={this.props.isPinned ? "check" : "pin"}
                className="d-flex align-items-center"
              />
              {label}
            </button>
            <div
              className="position-absolute d-flex align-items-center"
              style={{ bottom: "16px", right: "18px" }}
            >
              {this.props.deck.status === "private" && (
                <div className="text-muted small ml-1 p-0">
                  <div className="text-uppercase p-1">Private</div>
                </div>
              )}
              {this.props.deck.new && (
                <div className="badge badge-primary ml-1 p-0">
                  <div className="text-uppercase p-1">New</div>
                </div>
              )}
              {this.props.deck.pro && (
                <div className="badge badge-warning ml-1 d-flex align-items-center p-0">
                  <Octicon
                    name="star"
                    className="d-flex align-items-center ml-1"
                    width={13}
                    height={13}
                  />
                  <span className="text-uppercase pr-1 py-1 m-0" style={{ paddingLeft: "1px" }}>
                    Pro
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

DeckItem.defaultProps = {
  deck: {},
};

export default DeckItem;
