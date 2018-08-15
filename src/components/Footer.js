import React from "react";
import config from "../config";

const Footer = (onClickGithub, onClickDonate) => (
  <div className="container mt-3 p-4" style={{ alignSelf: "flexEnd" }}>
    <div className="row">
      <small className="col-md-4 text-secondary text-center text-md-left">
        © Flashcards For Developers 2018
      </small>
      <small className="col-md-4 text-secondary text-center">
        <span className="font-weight-bold mr-1" style={{ fontSize: "1.2em" }}>
          29,528
        </span>
        cards studied
      </small>
      <ul className="col-md-4 list-inline mb-0 text-center text-md-right">
      <li className="list-inline-item">
          <small>
            <a
              href={config.buyMeACoffeeDonateUrl}
              onClick={onClickDonate}
              target="_blank"
              className="text-secondary"
              rel="noopener noreferrer"
            >
              Support Us
            </a>
          </small>
        </li>
        <li className="list-inline-item">
          <small>
            <a
              href="https://github.com/nlaz/flashcards-for-developers"
              onClick={onClickGithub}
              target="_blank"
              className="text-secondary"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </small>
        </li>
        <li className="list-inline-item">
          <small>
            <a
              href={config.airtableFeedbackUrl}
              target="_blank"
              className="text-secondary"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </small>
        </li>
      </ul>
    </div>
  </div>
);

export default Footer;
