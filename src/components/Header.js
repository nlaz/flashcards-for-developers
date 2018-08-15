import React from "react";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from "react-share";

const title = "Helpful Flashcards for Developers @ ";


const Header = (onTwitterShare, onFacebookShare) => (
  <div className="app container">
    <div className="">
      <ul className=" header-right text-md-right">
        <li className="list-inline-item">
          <FacebookShareButton
            url="http://nlaz.github.io/flashcards-for-developers/#/"
            title={title}
            onShareWindowClose={onFacebookShare}
          >
            <i class="fab fa-facebook"></i>
          </FacebookShareButton>
        </li>

        <li className="list-inline-item">
          <TwitterShareButton
            url="http://nlaz.github.io/flashcards-for-developers/#/"
            title={title}
            onShareWindowClose={onTwitterShare}
          >
            <i class="fab fa-twitter fa-1x" style={{ padding: "0px 1px 2px 3px" }}></i>
          </TwitterShareButton>
        </li>
      </ul>
    </div>
  </div>
);

export default Header;