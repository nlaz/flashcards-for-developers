import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import cookie from "js-cookie";
import Tooltip from "rc-tooltip";

import * as analytics from "../components/GoogleAnalytics";
import isAuthenticated from "./utils/isAuthenticated";
import Octicon from "../components/Octicon";
import LoginModal from "./auth/LoginModal";

const title = "Ridiculously helpful collection of flashcards for developers ";

const LogoutTooltip = () => (
  <div className="tooltip-content">
    <div className="tooltip-item">
      <Link className="text-secondary" to="/collections/saved">
        My Saved Decks
      </Link>
    </div>
    <div className="tooltip-item">
      <Link
        className="text-secondary"
        onClick={() => analytics.logLoginAction("User logged out")}
        to="/logout"
      >
        Logout
      </Link>
    </div>
  </div>
);

const PlaceholderImage = () => (
  <div className="header-image d-flex align-items-center justify-content-center rounded rounded-circle bg-primary">
    <span
      role="img"
      aria-label="Placeholder profile image"
      style={{ marginRight: "3.5px", marginTop: "1px" }}
    >
      🐤
    </span>
  </div>
);

class Header extends Component {
  state = { showModal: false };

  onOpenModal = () => this.setState({ showModal: true });

  onCloseModal = () => {
    analytics.logLoginAction("User exited login modal");
    this.setState({ showModal: false });
  };

  render() {
    const authenticated = isAuthenticated();
    const user = authenticated ? JSON.parse(cookie.get("user")) : {};
    const isHomePage = this.props.location.pathname === "/";

    return (
      <div className="header">
        <LoginModal isOpen={this.state.showModal} onClose={this.onCloseModal} />
        <div className="container container--full d-flex justify-content-between align-items-center py-2 w-100">
          <div>
            {!isHomePage && (
              <div
                onClick={() => this.props.history.goBack()}
                className="d-flex align-items-center font-weight-medium text-dark p-2 btn btn-reset"
              >
                <Octicon name="chevron-left" className="d-flex mr-1" />
                <span className="d-none d-sm-inline">Flashcards for Developers</span>
              </div>
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
            {authenticated ? (
              <li className="header-login list-inline-item ml-2">
                <Tooltip
                  placement="bottomRight"
                  trigger={["click"]}
                  overlay={<LogoutTooltip />}
                  id="header-logout"
                >
                  <div>
                    {user.avatar_url ? (
                      <img
                        className="header-image rounded rounded-circle"
                        src={user.avatar_url}
                        alt="User profile"
                      />
                    ) : (
                      <PlaceholderImage />
                    )}
                  </div>
                </Tooltip>
              </li>
            ) : (
              [
                <li className="list-inline-item ml-2" key={1}>
                  <button
                    className="btn btn-sm btn-outline-dark d-flex px-3 py-2"
                    onClick={() => {
                      analytics.logLoginAction("User clicked 'Login' button");
                      this.onOpenModal();
                    }}
                  >
                    <small className="font-weight-bold">LOG IN</small>
                  </button>
                </li>,
                <li className="list-inline-item ml-1" key={2}>
                  <button
                    className="btn btn-sm btn-dark d-flex px-3 py-2"
                    onClick={() => {
                      analytics.logLoginAction("User clicked 'Signup' button");
                      this.onOpenModal();
                    }}
                  >
                    <small className="font-weight-bold">SIGN UP</small>
                  </button>
                </li>,
              ]
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
