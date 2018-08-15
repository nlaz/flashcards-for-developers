import React from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";

const title = "Helpful Flashcards for Developers @ ";

const Header = ({ onTwitterShare, onFacebookShare }) => (
  <div className="container">
    <div className="pt-3">
      <ul className=" header-right text-md-right">
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
