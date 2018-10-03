import React from "react";
import { Link } from "react-router-dom";

const TableHeader = ({ tier1, tier2, tier3 }) => (
  <div className="row">
    <div className="col-6" />
    <div className="col-2 text-center">
      <div className="mx-2 py-1 pt-4 px-2">
        <div className="text-large">{tier1}</div>
        <small className="text-muted">user / month</small>
      </div>
    </div>
    <div className="col-2 text-center">
      <div className="mx-2 py-1 pt-4 px-2 bg-blueLight rounded-huge-top">
        <div className="text-large">{tier2}</div>
        <small className="text-muted">user / month</small>
      </div>
    </div>
    <div className="col-2 text-center">
      <div className="mx-2 py-1 pt-4 px-2 bg-yellowLight rounded-huge-top">
        <div className="text-large">{tier3}</div>
        <small className="text-muted">user / month</small>
      </div>
    </div>
  </div>
);

const TableRow = ({ label, tier1, tier2, tier3 }) => (
  <div className="row font-weight-medium">
    <div className="col-6">
      <div className="py-2 text-underline">{label}</div>
    </div>
    <div className="col-2">
      <div className="mx-2 py-2 px-2 text-center">
        <small className="font-weight-medium">{tier1}</small>
      </div>
    </div>
    <div className="col-2">
      <div className="mx-2 py-2 px-2 bg-blueLight text-center">
        <small className="font-weight-medium">{tier2}</small>
      </div>
    </div>
    <div className="col-2">
      <div className="mx-2 py-2 px-2 bg-yellowLight text-center">
        <small className="font-weight-medium">{tier3}</small>
      </div>
    </div>
  </div>
);

const TableLabel = ({ label }) => (
  <div className="row font-weight-medium" style={{ height: "50px" }}>
    <div className="col-6 d-flex flex-column justify-content-end">
      <div className="py-2 pt-4 text-uppercase text-muted small">{label}</div>
    </div>
    <div className="col-2">
      <div className="mx-2 py-2 pt-4 px-2 text-center" />
    </div>
    <div className="col-2 d-flex flex-column">
      <div className="mx-2 py-2 pt-4 px-2 bg-blueLight text-center" style={{ flexGrow: 1 }} />
    </div>
    <div className="col-2 d-flex flex-column">
      <div className="mx-2 py-2 pt-4 px-2 bg-yellowLight text-center" style={{ flexGrow: 1 }} />
    </div>
  </div>
);

const TableFooter = () => (
  <div className="row">
    <div className="col-6" />
    <div className="col-2">
      <div className="mx-2 pt-5 pb-4 px-2 text-center" />
    </div>
    <div className="col-2">
      <div className="mx-2 pt-5 pb-4 px-2 px bg-blueLight rounded-huge-bottom text-center">
        <Link to="/pages/membership" className="text-underline font-weight-medium">
          Upgrade
        </Link>
      </div>
    </div>
    <div className="col-2">
      <div className="mx-2 pt-5 pb-4 px-2 bg-yellowLight rounded-huge-bottom text-center">
        <a
          href="mailto:hello@flashcardsfordevelopers.com"
          className="text-underline font-weight-medium"
        >
          Contact
        </a>
      </div>
    </div>
  </div>
);

const Membership = () => (
  <div className="container container--full py-5">
    <div className="row">
      <div className="col-12">
        <h1 className="font-weight-bold m-0" style={{ fontSize: "40px" }}>
          LEARN SMARTER, NOT HARDER
        </h1>
        <p
          className="text-muted font-weight-light"
          style={{ fontSize: "24px", maxWidth: "600px", lineHeight: "1.2em" }}
        >
          Be part of the new wave of education. Become a member of Flashcards for Developers for
          <span className="font-weight-medium"> $5/month</span>.
        </p>
      </div>
    </div>

    <div className="pb-3">
      <TableHeader tier1="$0" tier2="$5" tier3="✨" />
      <TableLabel label="Usage" />
      <TableRow label="Decks" tier1="Unlimited" tier2="Unlimited" tier3="Unlimited" />
      <TableRow label="Cards per deck" tier1="120" tier2="1000" tier3="Increased" />
      <TableRow label="Scheduled practice" tier1="✅" tier2="✅" tier3="✅" />
      <TableLabel label="Essentials" />
      <TableRow label="Review history" tier1="3 months" tier2="Unlimited" tier3="Unlimited" />
      <TableRow label="Pinned decks" tier1="10" tier2="100" tier3="Increased" />
      <TableRow label="Private decks" tier1="0" tier2="20" tier3="1000" />
      <TableFooter />
    </div>

    <div className="text-center mt-5 font-weight-medium">
      Questions? <a href="mailto:hello@flashcardsfordevelopers.com">Contact us</a>
    </div>

    <div className="row mt-5">
      <div className="col-12 pb-3">
        <div className="text-center text-uppercase text-muted">Frequently Asked Questions</div>
      </div>
      <div className="col-4 mb-3">
        <h5>What is a deck?</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget lectus nec ex
          hendrerit vulputate vel vel urna.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What is the per-deck limit?</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget lectus nec ex
          hendrerit vulputate vel vel urna.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What is scheduled practice?</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget lectus nec ex
          hendrerit vulputate vel vel urna.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What is review history?</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget lectus nec ex
          hendrerit vulputate vel vel urna.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What are pinned decks?</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget lectus nec ex
          hendrerit vulputate vel vel urna.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What are private decks?</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget lectus nec ex
          hendrerit vulputate vel vel urna.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What happens when I reach my usage limits?</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget lectus nec ex
          hendrerit vulputate vel vel urna.
        </p>
      </div>
      <div className="col-4 mb-3">
        <h5>What are my payment options?</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget lectus nec ex
          hendrerit vulputate vel vel urna.
        </p>
      </div>
    </div>
  </div>
);

export default Membership;
