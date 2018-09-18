import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import qs from "query-string";
import cookie from "js-cookie";
import Tooltip from "rc-tooltip";
import Modal from "react-modal";

import * as analytics from "./GoogleAnalytics";
import config from "../config/index";
import isAuthenticated from "../app/utils/isAuthenticated";
import Octicon from "./Octicon";

const title = "Ridiculously helpful collection of flashcards for developers ";

const GITHUB_PARAMS = qs.stringify({
  client_id: config.githubOAuthClientId,
  redirect_uri: config.githubOAuthRedirectURI,
});

const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?${GITHUB_PARAMS}`;

Modal.setAppElement("#root");

const LogoutTooltip = () => (
  <Link
    className="bg-light text-secondary"
    onClick={() => analytics.logUserAction("Clicked 'Logout'")}
    to="/logout"
  >
    Logout
  </Link>
);

const LoginModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} className="loginModal" overlayClassName="loginModal-overlay">
    <button className="loginModal-close btn btn-reset p-2" onClick={onClose}>
      <Octicon name="x" />
    </button>
    <div className="py-5 px-4 my-2">
      <div className="text-center mx-auto" style={{ maxWidth: "400px" }}>
        <h5 className="text-center mb-1">Login to Flashcards for Developers</h5>
        <p className="text-secondary font-weight-light">
          Sign in to save your progress and keep your favorite decks across devices.
        </p>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-sm btn-outline-dark text-uppercase py-2 px-3 d-flex"
          onClick={() => analytics.logUserAction("Clicked 'Login'")}
          href={GITHUB_OAUTH_URL}
        >
          <i className="fab fa-github-alt fa-lg mr-2" />
          <small className="font-weight-bold" style={{ lineHeight: "1.3em" }}>
            Log in with GitHub
          </small>
        </button>
      </div>
      <div className="text-center mt-2" style={{ opacity: 0.5 }}>
        <small className="text-muted">
          We'll never post to your account without your permission.
        </small>
      </div>
    </div>
  </Modal>
);

class Header extends Component {
  state = { showModal: true };

  onToggleModal = () => this.setState({ showModal: !this.state.showModal });

  render() {
    const authenticated = isAuthenticated();
    const user = authenticated ? JSON.parse(cookie.get("user")) : {};
    const isHomePage = this.props.location.pathname === "/";

    return (
      <div className="header">
        <LoginModal isOpen={this.state.showModal} onClose={this.onToggleModal} />
        <div className="container container--full d-flex justify-content-between align-items-center py-2 w-100">
          <div>
            {!isHomePage && (
              <Link
                to={{ pathname: "/", search: this.props.location.search }}
                className="d-flex align-items-center font-weight-medium text-dark p-2"
              >
                <Octicon name="chevron-left" className="d-flex mr-1" />
                <span className="d-none d-sm-inline">Flashcards for Developers</span>
              </Link>
            )}
          </div>
          <ul className="p-0 m-0">
            <li className="list-inline-item">
              <FacebookShareButton
                className="share-button p-2"
                url="http://www.flashcardsfordevelopers.com"
                quote={title}
                onShareWindowClose={() => analytics.logFacebookShare()}
                style={{ cursor: "pointer" }}
              >
                <i className="fab fa-facebook" />
              </FacebookShareButton>
            </li>
            <li className="list-inline-item">
              <TwitterShareButton
                className="share-button p-2"
                url="http://www.flashcardsfordevelopers.com"
                title={title}
                onShareWindowClose={() => analytics.logTwitterShare()}
                style={{ cursor: "pointer" }}
              >
                <i className="fab fa-twitter" />
              </TwitterShareButton>
            </li>
            <li className="header-login list-inline-item ml-2">
              {authenticated ? (
                <Tooltip
                  placement="bottomRight"
                  trigger={["click"]}
                  overlay={<LogoutTooltip />}
                  id="header-logout"
                >
                  <img
                    src={user.avatar_url}
                    alt="User profile"
                    className="rounded rounded-circle"
                  />
                </Tooltip>
              ) : (
                <button
                  className="btn btn-sm btn-outline-dark d-flex px-3 py-2"
                  onClick={this.onToggleModal}
                >
                  <small className="font-weight-bold">LOGIN</small>
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
