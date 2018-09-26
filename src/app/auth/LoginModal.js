import React from "react";
import qs from "query-string";
import Modal from "react-modal";

import config from "../../config/index";
import Octicon from "../../components/Octicon";
import * as analytics from "../../components/GoogleAnalytics";

const GITHUB_PARAMS = qs.stringify({
  client_id: config.githubOAuthClientId,
  redirect_uri: config.githubOAuthRedirectURI,
});
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?${GITHUB_PARAMS}`;

if (process.env.NODE_ENV !== "test") {
  Modal.setAppElement("#root");
}

const LoginModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} className="loginModal" overlayClassName="loginModal-overlay">
    <button className="loginModal-close btn btn-reset p-2" onClick={onClose}>
      <Octicon name="x" />
    </button>
    <div className="py-5 px-4 my-2 mx-auto" style={{ maxWidth: "400px" }}>
      <div className="text-center mx-auto">
        <h5 className="mb-1">Login to Flashcards for Developers</h5>
        <p className="text-secondary font-weight-light">
          Sign in to save your progress and track your favorite decks across devices.
        </p>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <a
          className="loginModal-button btn btn-sm btn-outline-dark"
          onClick={() => analytics.logLoginAction("Clicked on GitHub login button")}
          href={GITHUB_OAUTH_URL}
        >
          <i className="fab fa-github-alt fa-lg mr-2" />
          <small className="font-weight-bold">Log in with GitHub</small>
        </a>
      </div>
      <div className="text-center mt-2" style={{ opacity: 0.5 }}>
        <small className="text-muted">
          We'll never post to your account without your permission.
        </small>
      </div>
    </div>
  </Modal>
);

export default LoginModal;
