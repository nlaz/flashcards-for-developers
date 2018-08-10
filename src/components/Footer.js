import React from "react";
import config from "../config";

const Footer = () => (
  <div
    className="container mt-3 p-4 d-flex flex-column flex-sm-row justify-content-between align-items-center"
    style={{ alignSelf: "flexEnd" }}
  >
    <small className="text-secondary">© Flashcards For Developers 2018</small>
    <small className="text-secondary d-flex align-items-center">
      <span className="font-weight-bold mr-1" style={{ fontSize: "1.2em" }}>
        29,528
      </span>
      cards studied
    </small>
    <ul className="list-inline mb-0">
      <li className="list-inline-item">
        <small>
          <a
            href="https://github.com/nlaz/flashcards-for-developers"
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
);

export default Footer;
