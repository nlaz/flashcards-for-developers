import React, { Component } from "react";
import Modal from "react-modal";
import { Redirect } from "react-router-dom";
import Octicon from "../../components/Octicon";
import * as analytics from "../../components/GoogleAnalytics";


if (process.env.NODE_ENV !== "test") {
  Modal.setAppElement("#root");
}

class UpgradeModal extends Component {
  state = { redirect: false }

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  redirectUpgrade = () => {
    if (this.state.redirect) {
      return <Redirect to='/pages/membership' />
    }
  }

  render() {
    return (
    <Modal isOpen={this.props.isOpen} className="loginModal" overlayClassName="loginModal-overlay">
        <button className="loginModal-close btn btn-reset p-2" onClick={this.props.onClose}>
          <Octicon name="x" />
        </button>
        <div className="py-5 px-4 my-2 mx-auto" style={{ maxWidth: "400px" }}>
          <div className="text-center mx-auto">
            <h5 className="mb-1">Upgrade to a Pro Account</h5>
            <p className="text-secondary font-weight-light">
              Upgrade to a Pro account to get access to Pro level material, create private decks, and much more!
            </p>
          </div>
          <div className="d-flex justify-content-center mt-4">
            {this.redirectUpgrade()}
            <button
              className="loginModal-button btn btn-sm btn-outline-dark"
              onClick={() => {
                analytics.logProAction("Clicked on Modal Upgrade button");
                this.setRedirect();
                }}>
              <small className="font-weight-bold"> Upgrade</small>
              <span
                role="img"
                aria-label="emoji"
              >
                ⭐️
              </span>
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default UpgradeModal;
