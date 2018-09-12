import React from "react";
import { Link } from "react-router-dom";

import config from "../config";
import * as analytics from "./GoogleAnalytics";

const Footer = () => (
  <div className="container mt-3 p-4" style={{ alignSelf: "flexEnd" }}>
    <div className="row">
      <small className="col-md-4 text-secondary text-center text-md-left">
        © Flashcards For Developers 2018
      </small>
      <small className="col-md-4 text-secondary text-center">
        <strong>1856</strong> cards studied <strong>36,078</strong> times
      </small>
      <ul className="col-md-4 list-inline mb-0 text-center text-md-right">
        <li className="list-inline-item">
          <small>
            <a
              href={config.buyMeACoffeeDonateUrl}
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
            <Link
              onClick={() => analytics.logUserAction("Navigated to terms page")}
              className="text-secondary"
              to={"/pages/terms-of-service"}
            >
              Terms
            </Link>
          </small>
        </li>
        <li className="list-inline-item">
          <small>
            <Link
              onClick={() => analytics.logUserAction("Navigated to privacy page")}
              className="text-secondary"
              to={"/pages/privacy-policy"}
            >
              Privacy
            </Link>
          </small>
        </li>
        <li className="list-inline-item">
          <small>
            <a
              href="https://github.com/nlaz/flashcards-for-developers"
              onClick={() => analytics.logGithubInterest()}
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
