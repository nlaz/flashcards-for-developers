import React from "react";
import { Link } from "react-router-dom";

import * as analytics from "../components/GoogleAnalytics";
import isProMember from "./utils/isProMember";

const Footer = () => (
  <div className="bg-dark">
    <div className="container container--full d-flex flex-column flex-md-row align-items-center justify-content-between p-4">
      <div className="text-secondary d-flex flex-column">
        <small className="font-weight-medium">Flashcards For Developers © 2018</small>
        <small>2968 cards studied 111,385 times</small>
      </div>

      <ul className="list-inline mb-0 text-center text-md-right">
        <li className="list-inline-item">
          <small>
            <Link className="text-secondary" to="/pages/about">
              About
            </Link>
          </small>
        </li>
        {!isProMember() && (
          <li className="list-inline-item">
            <small>
              <Link className="text-secondary" to="/pages/membership">
                Upgrade
              </Link>
            </small>
          </li>
        )}
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
            <a className="text-secondary" href="mailto:hello@flashcardsfordevelopers.com">
              Contact
            </a>
          </small>
        </li>
      </ul>
    </div>
  </div>
);

export default Footer;
