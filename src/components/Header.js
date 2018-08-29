import React from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";

import config from "../config/index";
import * as analytics from "./GoogleAnalytics";

const title = "Helpful Flashcards for Developers @ ";

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
      </ul>
    </div>
  </div>
);

export default Header;
