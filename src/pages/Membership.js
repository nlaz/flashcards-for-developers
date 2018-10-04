import React from "react";
import { Link } from "react-router-dom";

import * as analytics from "../components/GoogleAnalytics";

const CheckMark = () => <i className="fas fa-check fa-lg" />;

const TableTop = () => (
  <div className="row mb-2">
    <div className="col-4">
      <h2 className="m-0">Pricing</h2>
    </div>
    <div className="col-8">
      <div className="row">
        <div className="col-4">
          <div className="text-center text-uppercase font-weight-medium">Free</div>
        </div>
        <div className="col-4">
          <div className="text-center text-uppercase font-weight-medium">Member</div>
        </div>
        <div className="col-4">
          <div className="text-center text-uppercase font-weight-medium">Organizations</div>
        </div>
      </div>
    </div>
  </div>
);

const TableHeader = ({ tier1, tier2, tier3 }) => (
  <div className="row">
    <div className="col-4" />
    <div className="col-8">
      <div className="row">
        <div className="col-4 text-center">
          <div className="py-1 pt-5 px-2 bg-grayLight rounded-huge-top">
            <div className="text-large">{tier1}</div>
            <small className="text-muted">per month</small>
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="py-1 pt-5 px-2 bg-blueLight rounded-huge-top">
            <div className="text-large">{tier2}</div>
            <small className="text-muted">per month</small>
          </div>
        </div>
        <div className="col-4 text-center d-flex flex-column">
          <div
            className="py-1 pt-5 px-2 bg-dark text-white rounded-huge-top"
            style={{ flexGrow: 1 }}
          >
            <div className="text-large">{tier3}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TableRow = ({ label, tier1, tier2, tier3 }) => (
  <div className="row table-row font-weight-medium">
    <div className="col-4">
      <div className="py-2 text-underline">{label}</div>
    </div>
    <div className="col-8">
      <div className="row">
        <div className="col-4">
          <div className="py-2 px-2 bg-grayLight text-center">
            <span className="font-weight-medium">{tier1}</span>
          </div>
        </div>
        <div className="col-4">
          <div className="py-2 px-2 bg-blueLight text-center" style={{ zIndex: -1 }}>
            <span className="font-weight-medium" style={{ zIndex: 1 }}>
              {tier2}
            </span>
          </div>
        </div>
        <div className="col-4">
          <div className="py-2 px-2 bg-dark text-white text-center">
            <span className="font-weight-medium">{tier3}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TableLabel = ({ label }) => (
  <div className="row font-weight-medium" style={{ height: "50px" }}>
    <div className="col-4 d-flex flex-column justify-content-end">
      <div className="py-3 pt-4 text-uppercase text-muted small">{label}</div>
    </div>
    <div className="col-8 d-flex flex-column">
      <div className="row" style={{ flexGrow: 1 }}>
        <div className="col-4 d-flex flex-column">
          <div className="py-2 pt-4 px-2 text-center bg-grayLight" style={{ flexGrow: 1 }} />
        </div>
        <div className="col-4 d-flex flex-column">
          <div className="py-2 pt-4 px-2 bg-blueLight text-center" style={{ flexGrow: 1 }} />
        </div>
        <div className="col-4 d-flex flex-column">
          <div className="py-2 pt-4 px-2 bg-dark text-white text-center" style={{ flexGrow: 1 }} />
        </div>
      </div>
    </div>
  </div>
);

const TableFooter = () => (
  <div className="row">
    <div className="col-4" />
    <div className="col-8">
      <div className="row">
        <div className="col-4 d-flex flex-column">
          <div
            className="pt-5 pb-5 px-2 bg-grayLight text-center rounded-huge-bottom"
            style={{ flexGrow: 1 }}
          />
        </div>
        <div className="col-4">
          <div className="pt-5 pb-5 px-2 px bg-blueLight rounded-huge-bottom text-center">
            <Link
              to="/pages/membership"
              className="text-underline font-weight-medium"
              onClick={() =>
                analytics.logMembershipAction("Clicked Member tier on membership page")
              }
              style={{ fontSize: "1.25em" }}
            >
              Get started
            </Link>
          </div>
        </div>
        <div className="col-4">
          <div className="pt-5 pb-5 px-2 bg-dark text-white rounded-huge-bottom text-center">
            <a
              href="mailto:hello@flashcardsfordevelopers.com"
              className="text-underline font-weight-medium text-white"
              style={{ fontSize: "1.25em" }}
              onClick={() =>
                analytics.logMembershipAction("Clicked Organizations tier on membership page")
              }
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Membership = () => (
  <div className="container container--full py-5">
    <div className="px-5 row">
      <div className="col-12">
        <h1 className="font-weight-bold m-0" style={{ fontSize: "40px" }}>
          LEARN SMARTER, NOT LONGER
        </h1>
        <p
          className="text-muted font-weight-light"
          style={{ fontSize: "24px", maxWidth: "600px", lineHeight: "1.2em" }}
        >
          Be part of the new way of learning. Become a member of Flashcards for Developers for
          <span className="font-weight-medium"> $5/month</span>.
        </p>
      </div>
    </div>

    <div className="px-5 mt-5">
      <TableTop />
      <TableHeader tier1="$0" tier2="$5" tier3="✨" />
      <TableLabel label="Usage" />
      <TableRow label="Decks" tier1="Unlimited" tier2="Unlimited" tier3="Unlimited" />
      <TableRow label="Flashcards" tier1="120" tier2="1200" tier3="Increased" />
      <TableRow
        label="Scheduled practice"
        tier1={<CheckMark />}
        tier2={<CheckMark />}
        tier3={<CheckMark />}
      />
      <TableLabel label="Essentials" />
      <TableRow label="Review history" tier1="3 months" tier2="Unlimited" tier3="Unlimited" />
      <TableRow label="Pinned decks" tier1="10" tier2="100" tier3="Increased" />
      <TableRow label="Private decks" tier1="-" tier2="10" tier3="100" />
      <TableFooter />
    </div>

    <div className="row my-5">
      <div className="col-12 mt-5 py-5">
        <div className="text-center text-uppercase text-muted font-weight-medium">
          Frequently Asked Questions
        </div>
        <div className="text-center text-muted font-weight-medium">
          Questions? <a href="mailto:hello@flashcardsfordevelopers.com">Contact us</a>
        </div>
      </div>
      <div className="col-4 mb-3">
        <h5>What is a deck?</h5>
        <p>
          A deck is a collection of related flashcards. They often represent a single subject that
          you can study. For example, you could study our Big-O notation deck.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What is the flashcard limit?</h5>
        <p>
          While we don't limit the number of decks you can create, we do limit the number of
          flashcards you can create. On the Free plan, we limit the total flashcards you can create.
          You can increase these limits by upgrading to our Member plan.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What is scheduled practice?</h5>
        <p>
          Flashcards are scheduled at increasing intervals to improve your ability to recall and
          reduce the effort learning them. This technique, called spaced repetition, is a proven way
          to study effectively.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What is review history?</h5>
        <p>
          Your review history is a snapshot of your study activity. You can view a living history of
          your study habits. We provide a limited history for free plans, with extended histories
          for our Member plan.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What are pinned decks?</h5>
        <p>
          Pinned decks are favorite decks you want to keep studying. They are easier to find and can
          be studied all at once.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What are private decks?</h5>
        <p>
          Private decks are collections of personal flashcards that are not visible to other users.
          Thes might contain private information or be highly customized study material.
        </p>
      </div>
    </div>
  </div>
);

export default Membership;
