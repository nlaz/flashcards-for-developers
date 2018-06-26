import React from "react";
import { Link } from "react-router-dom";

import Octicon from "./Octicon";

const NotFound = () => (
  <div className="container p-4">
    <Link to="/" className="text-dark d-flex align-items-center mb-2">
      <Octicon name="chevron-left" className="d-flex mr-1" />
      Back to Home
    </Link>
    <div className="text-center">
      <h1 className="mt-5 m-0" style={{ fontSize: "30px" }}>
        <code>404 Not Found</code>
      </h1>
      <p className="text-dark" style={{ fontWeight: "500" }}>
        The page you were looking for doesn't exist.
      </p>
      <span style={{ fontSize: "80px" }} role="img" aria-label="embarrassed emoji">
        😅
      </span>
    </div>
  </div>
);

export default NotFound;
