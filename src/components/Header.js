import React from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import qs from "query-string";
import cookie from "js-cookie";

import * as analytics from "./GoogleAnalytics";
import config from "../config/index";
import isAuthenticated from "../app/utils/isAuthenticated";

const title = "Helpful Flashcards for Developers @ ";

const GITHUB_PARAMS = qs.stringify({
  client_id: config.githubOAuthClientId,
  redirect_uri: config.githubOAuthRedirectURI,
});

const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?${GITHUB_PARAMS}`;

const Header = () => {
  const authenticated = isAuthenticated();
  const user = authenticated ? JSON.parse(cookie.get("user")) : {};

  console.log("user", user);

  return (
    <div className="container px-4">
      <div className="pt-3">
        <ul className="header-right text-right p-0">
          <li className="list-inline-item mr-2">
            <a
              className="text-secondary"
              href={config.buyMeACoffeeDonateUrl}
              onClick={() => analytics.logDonateEvent3()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>Support Us</small>
            </a>
          </li>
          <li className="list-inline-item mr-2">
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
          <li className="list-inline-item ml-2">
            {authenticated ? (
              <img
                src={user.avatar_url}
                style={{ width: "35px", height: "35px" }}
                alt="User profile"
                className="rounded rounded-circle"
              />
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

export default Header;
