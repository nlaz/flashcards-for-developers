import React, { Component } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import cookie from "js-cookie";

import * as api from "../apiActions";
import Octicon from "../../components/Octicon";

Modal.setAppElement("#root");

class SignupFormModal extends Component {
  state = { profile: { email: "", name: "" } };

  constructor(props) {
    super(props);

    this.state = { profile: { ...props.profile } };
  }

  onChange = e =>
    this.setState({ profile: { ...this.state.profile, [e.target.name]: e.target.value } });

  onSubmit = e => {
    e.preventDefault();
    api.registerGithubUser(this.state.profile).then(response => {
      const token = response.headers.authorization.split(" ")[1];
      cookie.set("token", token);
      cookie.set("user", response.data);
      this.props.onClose();
    });
  };

  render() {
    const { onClose } = this.props;
    const { profile = {} } = this.state;

    return (
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
            <form style={{ maxWidth: "325px" }} onSubmit={this.onSubmit}>
              <div className="form-group">
                <label className="small font-weight-bold mb-1" style={{ opacity: 0.85 }}>
                  Enter your full name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-sm"
                  placeholder="What should we call you?"
                  onChange={this.onChange}
                  value={profile.name || ""}
                />
              </div>
              <div className="form-group">
                <label className="small font-weight-bold mb-1" style={{ opacity: 0.85 }}>
                  Enter your email address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-sm"
                  placeholder="you@your-domain.com"
                  onChange={this.onChange}
                  value={profile.email || ""}
                />
              </div>
              <div className="mt-5 pt-5">
                <button className="btn btn-dark btn-sm font-weight-medium py-2 w-100">
                  SIGN UP
                </button>
              </div>
              <div className="text-center text-md-left mt-2" style={{ opacity: 0.5 }}>
                <small className="text-muted">
                  By signing up, you agree to our <Link to="/pages/terms-of-service">terms</Link>{" "}
                  and <Link to="/pages/privacy-policy">privacy policy</Link>.
                </small>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    );
  }
}

export default SignupFormModal;
