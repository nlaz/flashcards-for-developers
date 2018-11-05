import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import cookie from "js-cookie";
import Tooltip from "rc-tooltip";
import SearchBar from "../components/SearchBar";
import * as analytics from "../components/GoogleAnalytics";
import isAuthenticated from "./utils/isAuthenticated";
import isProMember from "./utils/isProMember";
import Octicon from "../components/Octicon";
import LoginModal from "./auth/LoginModal";

const LogoutTooltip = ({ user }) => (
  <div className="tooltip-content">
    <div className="tooltip-item">
      <Link className="text-secondary" to={`/${user.username}`}>
        My Profile
      </Link>
    </div>
    <div className="tooltip-item">
      <Link className="text-secondary" to={`/${user.username}/pinned`}>
        My Pinned Decks
      </Link>
    </div>
    <div className="tooltip-item">
      <Link className="text-secondary" to={`/${user.username}/decks`}>
        My Decks
      </Link>
    </div>
    <hr className="m-0 my-1" />
    <div className="tooltip-item">
      <Link className="text-secondary" to="/settings/profile">
        Settings
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
  state = {
    showModal: false,
    content: [],
    isLoading: true,
  };

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
          <div className="d-flex align-items-center">
            {!isHomePage && (
              <Link
                to="/"
                className="d-flex align-items-center font-weight-medium text-dark py-2 pl-0 pr-2 btn btn-reset"
              >
                <Octicon
                  name="chevron-left"
                  className="d-md-none d-flex mr-1"
                  width={18}
                  height={18}
                />
                <span className="d-none d-sm-inline">Flashcards for Developers</span>
              </Link>
            )}
            {isHomePage && (
              <div className="d-none d-md-block">
                <SearchBar />
              </div>
            )}
          </div>
          <ul className="d-flex align-items-center p-0 m-0">
            {!isProMember() && (
              <Link
                className="d-none d-sm-flex align-items-center btn-member mr-2"
                to="/pages/membership"
                onClick={() =>
                  analytics.logMembershipAction("User clicked 'Upgrade' button in header")
                }
              >
                Become a Pro member
              </Link>
            )}

            {authenticated
              ? [
                  <li className="list-inline-item mx-0" key={0}>
                    <Link to="/decks/new">
                      <Octicon
                        className="nav-icon d-flex align-items-center p-2"
                        name="plus"
                        width={20}
                        height={20}
                      />
                    </Link>
                  </li>,
                  <li className="list-inline-item mx-0" key={-1}>
                    <Link to={`/${user.username}/pinned`}>
                      <Octicon
                        className="nav-icon d-flex align-items-center p-2"
                        name="pin"
                        width={20}
                        height={20}
                      />
                    </Link>
                  </li>,
                  <li className="header-login list-inline-item ml-3" key={1}>
                    <Tooltip
                      placement="bottomRight"
                      trigger={["click"]}
                      overlay={<LogoutTooltip user={user} />}
                      id="header-logout"
                    >
                      <div className="position-relative">
                        {user.avatar_url ? (
                          <img
                            className="header-image rounded rounded-circle bg-light"
                            src={user.avatar_url}
                            alt="User profile"
                          />
                        ) : (
                          <PlaceholderImage />
                        )}
                        {isProMember() && (
                          <span
                            role="img"
                            aria-label="emoji"
                            className="position-absolute"
                            style={{ bottom: "-5px", right: "-5px" }}
                          >
                            🌟
                          </span>
                        )}
                      </div>
                    </Tooltip>
                  </li>,
                ]
              : [
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
                ]}
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
