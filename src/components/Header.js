import React from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import config from "../config/index";

const title = "Helpful Flashcards for Developers @ ";

const Header = ({ onTwitterShare, onFacebookShare, onSupportUs }) => (
  <div className="container px-4">
    <div className="pt-3">
      <ul className="header-right text-right p-0">
        <li className="list-inline-item mr-2">
          <a
            className="text-secondary"
            href={config.buyMeACoffeeDonateUrl}
            onClick={onSupportUs}
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
            onShareWindowClose={onFacebookShare}
            style={{ cursor: "pointer" }}
          >
            <i className="fab fa-facebook" />
          </FacebookShareButton>
        </li>
        <li className="list-inline-item">
          <TwitterShareButton
            url="http://nlaz.github.io/flashcards-for-developers/#/"
            title={title}
            onShareWindowClose={onTwitterShare}
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
