import React from "react";
import { Link, withRouter } from "react-router-dom";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import qs from "query-string";
import cookie from "js-cookie";
import Tooltip from "rc-tooltip";

import * as analytics from "./GoogleAnalytics";
import config from "../config/index";
import isAuthenticated from "../app/utils/isAuthenticated";
import Octicon from "./Octicon";

const title = "Helpful Flashcards for Developers @ ";

const GITHUB_PARAMS = qs.stringify({
  client_id: config.githubOAuthClientId,
  redirect_uri: config.githubOAuthRedirectURI,
});

const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?${GITHUB_PARAMS}`;

const Header = ({ location }) => {
  const authenticated = isAuthenticated();
  const user = authenticated ? JSON.parse(cookie.get("user")) : {};
  const isHomePage = location.pathname === "/";

  const tooltip = (
    <Link className="bg-light text-secondary" to="/logout">
      Logout
    </Link>
  );

  return (
    <div className="header">
      <div className="container container--full d-flex justify-content-between align-items-center py-2 w-100">
        <div>
          {!isHomePage && (
            <Link
              to={{ pathname: "/", search: location.search }}
              className="py-2 d-flex align-items-center font-weight-medium text-dark"
            >
              <Octicon name="chevron-left" className="d-flex mr-1" />
              Flashcards for Developers
            </Link>
          )}
        </div>
        <ul className="p-0 m-0">
          <li className="list-inline-item mr-3">
            <FacebookShareButton
              url="http://nlaz.github.io/flashcards-for-developers/#/"
              quote={title}
              onShareWindowClose={() => analytics.logFacebookShare()}
              style={{ cursor: "pointer" }}
            >
              <i className="fab fa-facebook" />
            </FacebookShareButton>
          </li>
          <li className="list-inline-item">
            <TwitterShareButton
              url="http://nlaz.github.io/flashcards-for-developers/#/"
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
                overlay={tooltip}
                id="header-logout"
              >
                <img src={user.avatar_url} alt="User profile" className="rounded rounded-circle" />
              </Tooltip>
            ) : (
              <a className="btn btn-sm btn-outline-dark" href={GITHUB_OAUTH_URL}>
                Login with GitHub
              </a>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default withRouter(Header);
