import React, { Component }  from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import * as utils from "../utils/studyProgress";
import ProgressBar from "../../components/ProgressBar";
import Octicon from "../../components/Octicon";

import isProMember from "../utils/isProMember";
import UpgradeModal from "../auth/UpgradeModal";

import * as analytics from "../../components/GoogleAnalytics";

class DeckItem extends Component {
  state = { 
    showUpgradeModal: false,
  };

  onOpenUpgradeModal = (e) => {
    e.preventDefault();
    this.setState({ showUpgradeModal: true });
  }

  onCloseUpgradeModal = () => {
    analytics.logProAction("User exited upgrade modal from 'Deck Item'");
    this.setState({ showUpgradeModal: false });
  };

  render() {
    const progress = utils.calcStudyProgress(this.props.deck, this.props.deckProgress);
    const proficiency = utils.calcStudyProficiency(this.props.deckProgress);
    const label = this.props.isPinned ? "Pinned" : "Pin";

    return (
      <div className="deck-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
        <UpgradeModal isOpen={this.state.showUpgradeModal} onClose={this.onCloseUpgradeModal} />

        {this.props.deck.pro && !isProMember() && (         
          <Link
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
            onClick={e => { 
              analytics.logProAction("User clicked a 'Pro' level deck button");
              this.onOpenUpgradeModal(e);
            }}
          >
            <div>
              <ProgressBar className="mb-2" progress={progress} proficiency={proficiency} />
              {this.props.deck.name}
              <button
                className={cx("pin-btn badge position-absolute align-items-center p-1 text-uppercase", {
                  "pin-btn-active bg-dark text-white": this.props.isPinned,
                })}
                style={{ bottom: "16px", left: "18px" }}
                onClick={e => this.props.onTogglePin(e, this.props.deck)}
              >
                <Octicon name={this.props.isPinned ? "check" : "pin"} className="d-flex align-items-center" />
                {label}
              </button>
              {this.props.deck.pro && (
                <div
                  className="badge badge-danger ml-2 position-absolute p-1 text-uppercase"
                  style={{ bottom: "16px", right: "60px" }}
                >
                  Pro
                </div>
              )}
              {this.props.deck.new && (
                <div
                  className="badge badge-primary ml-2 position-absolute p-1 text-uppercase"
                  style={{ bottom: "16px", right: "18px" }}
                >
                  New
                </div>
              )}
            </div>
          </Link>
        )}

        {this.props.deck.pro && isProMember() && (         
          <Link
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
            onClick={e => { 
              analytics.logProAction("User successfully clicked a 'Pro' level deck button");
            }}
          >
            <div>
              <ProgressBar className="mb-2" progress={progress} proficiency={proficiency} />
              {this.props.deck.name}
              <button
                className={cx("pin-btn badge position-absolute align-items-center p-1 text-uppercase", {
                  "pin-btn-active bg-dark text-white": this.props.isPinned,
                })}
                style={{ bottom: "16px", left: "18px" }}
                onClick={e => this.props.onTogglePin(e, this.props.deck)}
              >
                <Octicon name={this.props.isPinned ? "check" : "pin"} className="d-flex align-items-center" />
                {label}
              </button>
              {this.props.deck.pro && (
                <div
                  className="badge badge-danger ml-2 position-absolute p-1 text-uppercase"
                  style={{ bottom: "16px", right: "60px" }}
                >
                  Pro
                </div>
              )}
              {this.props.deck.new && (
                <div
                  className="badge badge-primary ml-2 position-absolute p-1 text-uppercase"
                  style={{ bottom: "16px", right: "18px" }}
                >
                  New
                </div>
              )}
            </div>
          </Link>
        )}

        {!this.props.deck.pro && (         
          <Link
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
                className={cx("pin-btn badge position-absolute align-items-center p-1 text-uppercase", {
                  "pin-btn-active bg-dark text-white": this.props.isPinned,
                })}
                style={{ bottom: "16px", left: "18px" }}
                onClick={e => this.props.onTogglePin(e, this.props.deck)}
              >
                <Octicon name={this.props.isPinned ? "check" : "pin"} className="d-flex align-items-center" />
                {label}
              </button>
              {this.props.deck.pro && (
                <div
                  className="badge badge-danger ml-2 position-absolute p-1 text-uppercase"
                  style={{ bottom: "16px", right: "60px" }}
                >
                  Pro
                </div>
              )}
              {this.props.deck.new && (
                <div
                  className="badge badge-primary ml-2 position-absolute p-1 text-uppercase"
                  style={{ bottom: "16px", right: "18px" }}
                >
                  New
                </div>
              )}
            </div>
          </Link>
        )}
      </div>
    );
  };
}

DeckItem.defaultProps = {
  deck: {},
};

export default DeckItem;
