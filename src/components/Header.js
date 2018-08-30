import React from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import qs from "query-string";

import config from "../config/index";
import * as analytics from "./GoogleAnalytics";

const title = "Helpful Flashcards for Developers @ ";

const GITHUB_PARAMS = qs.stringify({
  client_id: config.githubOAuthClientId,
  redirect_uri: config.githubOAuthRedirectURI,
});

const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?${GITHUB_PARAMS}`;

const Header = () => (
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
        <li className="list-inline-item">
          <a className="btn btn-sm btn-outline-dark" href={GITHUB_OAUTH_URL}>
            Login with GitHub
          </a>
        </li>
      </ul>
    </div>
  </div>
);

export default Header;
