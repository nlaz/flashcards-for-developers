import React from "react";
import "./Toggle.css";

const Toggle = ({ onChange, checked }) => (
  <label className="switch m-0">
    <input onChange={onChange} type="checkbox" checked={checked} />
    <span className="slider round" />
  </label>
);

export default Toggle;
