import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import Octicon from "../../components/Octicon";
import * as analytics from "../../components/GoogleAnalytics";

if (process.env.NODE_ENV !== "test") {
  Modal.setAppElement("#root");
}

class UpgradeModal extends Component {
  state = { redirect: false };

  setRedirect = () => {
    this.setState({
      redirect: true,
    });
  };

  redirectUpgrade = () => {
    if (this.state.redirect) {
      return <Redirect to="/pages/membership" />;
    }
  };

  render() {
    const title = this.props.title || "Unlock more content with Flashcards Pro";

    return (
      <Modal
        isOpen={this.props.isOpen}
        className="loginModal"
        overlayClassName="loginModal-overlay"
      >
        <div className="p-3 rounded-top text-center" style={{ background: "antiquewhite" }}>
          <button className="loginModal-close btn btn-reset p-2" onClick={this.props.onClose}>
            <Octicon name="x" />
          </button>
          <span style={{ fontSize: "90px" }} role="img" aria-label="emoji">
            🏅
          </span>
        </div>
        <div className="py-5 px-4 mb-4 mx-auto" style={{ maxWidth: "430px" }}>
          <div className="text-center mx-auto">
            <h5 className="mb-1">{title}</h5>
            <p className="text-secondary font-weight-light">
              Upgrade to a Pro account to get access to more material, create private decks, and
              much more!
            </p>
          </div>
          <div className="d-flex justify-content-center mt-4">
            {this.redirectUpgrade()}
            <button
              className="loginModal-button btn btn-sm btn-outline-dark"
              onClick={() => {
                analytics.logProAction("Clicked on Modal Upgrade button");
                this.context.mixpanel.track("Clicked on Modal Upgrade button.");
                this.setRedirect();
              }}
            >
              <small className="font-weight-bold mr-1">Learn more</small>
              <span role="img" aria-label="emoji">
                ⭐️
              </span>
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

UpgradeModal.contextTypes = {
  mixpanel: PropTypes.object.isRequired,
};
export default UpgradeModal;
