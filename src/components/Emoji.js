import React from "react";

// Component used to deal with a11y requirements
const Emoji = ({ className, value, label = "" }) => (
  <span className={className} role="img" aria-label={label}>
    {value}
  </span>
);

export default Emoji;
