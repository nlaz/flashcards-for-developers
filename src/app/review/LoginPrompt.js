import React, { Component } from "react";

import LoginModal from "../auth/LoginModal";
import * as analytics from "../../components/GoogleAnalytics";

class LoginPrompt extends Component {
  state = { showModal: false };

  onOpenModal = () => this.setState({ showModal: true });

  onCloseModal = () => {
    analytics.logLoginAction("User exited login modal from 'Review Results'");
    this.setState({ showModal: false });
  };

  render() {
    return (
      <div>
        <LoginModal isOpen={this.state.showModal} onClose={this.onCloseModal} />
        <div className="loginPrompt py-2 position-absolute text-center">
          <span role="img" aria-label="Save!">
            💾
          </span> 
            {" "}SIGN IN TO SAVE YOUR PROGRESS {" "}
            <button
              className="btn btn-sm btn-outline-dark px-3 py-2"
              onClick={() => {
                analytics.logLoginAction("User clicked 'Login' button from 'Review Results'");
                this.onOpenModal();
              }}
            >
            <small className="font-weight-bold">LOG IN</small>
            </button>
        </div>
      </div>
    );
  }
}

export default LoginPrompt;