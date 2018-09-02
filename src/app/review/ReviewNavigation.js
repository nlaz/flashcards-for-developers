import React from "react";
import { Link } from "react-router-dom";
import Octicon from "../../components/Octicon";

const ReviewNavigation = ({ location }) => (
  <div className="navbar">
    <Link
      to={{ pathname: "/", search: location.search }}
      className="py-2 d-flex align-items-center font-weight-medium text-dark"
    >
      <Octicon name="chevron-left" className="d-flex mr-1" />
      Flashcards for Developers
    </Link>
  </div>
);

export default ReviewNavigation;
