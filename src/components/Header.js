import React, { Component } from "react";
import { TwitterShareButton, TwitterIcon } from "react-share";
import * as analytics from "./GoogleAnalytics";

const title = "Helpful Flashcards for Developers @ ";

class Header extends Component {
  onShare = () => {
    analytics.logTwitterShare();
  };

  render() {
    return (
      <div className="container mt-3">
        <div className="row">
          <ul className=" header-right text-md-right">
            <li className="list-inline-item">
              <TwitterShareButton
                url="http://nlaz.github.io/flashcards-for-developers/#/"
                title={title}
                className="Demo__some-network__share-button"
                onShareWindowClose={() => this.onShare()}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </li>
          </ul>
        </div>

      </div>
    );
  }
}
export default Header;
