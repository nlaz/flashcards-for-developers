import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";

import Octicon from "../../components/Octicon";

Modal.setAppElement("#root");

const SignupFormModal = ({ onClose }) => (
  <Modal isOpen={true} className="loginModal" overlayClassName="loginModal-overlay">
    <button className="loginModal-close btn btn-reset p-2" onClick={onClose}>
      <Octicon name="x" />
    </button>
    <div className="py-5 px-4 my-2 mx-auto" style={{ maxWidth: "550px" }}>
      <div className="text-left mx-auto">
        <h5 className="mb-3">
          <span className="mr-2" role="img" aria-label="Party emoji">
            🎉
          </span>
          Happy to have you here!
        </h5>
        <form style={{ maxWidth: "325px" }}>
          <div className="form-group">
            <label className="small font-weight-bold mb-1" style={{ opacity: 0.85 }}>
              Enter your full name
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="What should we call you?"
            />
          </div>
          <div className="form-group">
            <label className="small font-weight-bold mb-1" style={{ opacity: 0.85 }}>
              Enter your email address
            </label>
            <input
              type="email"
              className="form-control form-control-sm"
              placeholder="you@your-domain.com"
            />
          </div>
          <div className="mt-5 pt-5">
            <button className="btn btn-dark btn-sm font-weight-medium py-2 w-100">SIGN UP</button>
          </div>
          <div className="text-center text-md-left mt-2" style={{ opacity: 0.5 }}>
            <small className="text-muted">
              By signing up, you agree to our <Link to="/pages/terms-of-service">terms</Link> and{" "}
              <Link to="/pages/privacy-policy">privacy policy</Link>.
            </small>
          </div>
        </form>
      </div>
    </div>
  </Modal>
);

export default SignupFormModal;
