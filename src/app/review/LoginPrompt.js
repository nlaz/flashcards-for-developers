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
        <div className="loginPrompt text-center py-1">
          <span role="img" aria-label="Save!">
            💾
          </span>
          <span className="ml-1 mr-2">SIGN IN TO SAVE YOUR PROGRESS</span>
          <button
            className="btn btn-sm btn-darkblue d-flex"
            onClick={() => {
              analytics.logLoginAction("User clicked 'Login' button from 'Review Results'");
              this.onOpenModal();
            }}
          >
            <small className="font-weight-medium">LOG IN</small>
          </button>
        </div>
      </div>
    );
  }
}

export default LoginPrompt;
