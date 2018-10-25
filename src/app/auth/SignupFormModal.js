import React, { Component } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import cookie from "js-cookie";

import * as api from "../apiActions";
import Octicon from "../../components/Octicon";
import * as analytics from "../../components/GoogleAnalytics";
import * as localStorage from "../utils/localStorage";

if (process.env.NODE_ENV !== "test") {
  Modal.setAppElement("#root");
}

const ERRORS = { REQUIRED: "Required", INVALID: "Invalid" };

class SignupFormModal extends Component {
  state = {
    profile: { email: "", name: "", email_notification: true },
    errors: { email: undefined, name: undefined },
  };

  componentDidMount() {
    this.setState({ profile: { ...this.props.profile, email_notification: true } });
  }

  validateEmail = email => {
    const isValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const validMessage = !isValid ? ERRORS.INVALID : undefined;
    return email.length === 0 ? ERRORS.REQUIRED : validMessage;
  };

  validateName = name => {
    return name.length === 0 ? ERRORS.REQUIRED : undefined;
  };

  onChange = e =>
    this.setState({ profile: { ...this.state.profile, [e.target.name]: e.target.value } });

  onToggle = field =>
    this.setState(({ profile }) => ({ profile: { ...profile, [field]: !profile[field] } }));

  onSubmit = e => {
    e.preventDefault();
    const { profile, errors } = this.state;
    const { email, name } = profile;

    this.setState(
      {
        errors: {
          ...errors,
          email: this.validateEmail(email || ""),
          name: this.validateName(name || ""),
        },
      },
      () => this.signupUser(),
    );
  };

  signupUser = () => {
    const { errors } = this.state;
    if (!errors.email && !errors.name) {
      api
        .registerGithubUser(this.state.profile)
        .then(response => {
          analytics.logLoginAction("User signed up");
          const token = response.headers.authorization.split(" ")[1];
          cookie.set("token", token);
          cookie.set("user", response.data);
          this.syncPinnedDecks();
          this.syncStudySessions();
          this.syncStudyProgress();
          this.props.onClose();
        })
        .catch(this.handleError);
    }
  };

  syncPinnedDecks = () => {
    const pinnedDecks = localStorage.getPinnedDecks();
    if (pinnedDecks.length > 0) {
      api.addPinnedDecks(pinnedDecks).catch(this.handleError);
    }
  };

  syncStudySessions = () => {
    const studySessions = localStorage.getStudySessions();
    if (studySessions.length > 0) {
      api.addStudySessions(studySessions).catch(this.handleError);
    }
  };

  syncStudyProgress = () => {
    const studyProgress = localStorage.getStudyProgress();
    if (studyProgress.length > 0) {
      api.addStudyProgress(studyProgress).catch(this.handleError);
    }
  };

  handleError = error => this.props.onClose();

  render() {
    const { onClose } = this.props;
    const { profile = {}, errors = {} } = this.state;

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
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="small font-weight-bold m-0" style={{ opacity: 0.85 }}>
                    Enter your full name
                  </label>
                  {errors.name && (
                    <small className="text-danger text-uppercase ml-2 shake--error">
                      {errors.name}
                    </small>
                  )}
                </div>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-sm"
                  placeholder="What should we call you?"
                  onChange={this.onChange}
                  value={profile.name || ""}
                />
              </div>
              <div className="form-group mb-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="small font-weight-bold m-0  " style={{ opacity: 0.85 }}>
                    Enter your email address
                  </label>
                  {errors.email && (
                    <small className="text-danger text-uppercase ml-2 shake--error">
                      {errors.email}
                    </small>
                  )}
                </div>
                <input
                  type="text"
                  name="email"
                  className="form-control form-control-sm"
                  placeholder="you@your-domain.com"
                  onChange={this.onChange}
                  value={profile.email || ""}
                />
              </div>
              <div className="d-flex align-items-center mb-2">
                <input
                  type="checkbox"
                  name="email_notification"
                  onChange={() => this.onToggle("email_notification")}
                  checked={profile.email_notification}
                />
                <label className="ml-2 small m-0">
                  Notify me about upcoming flashcards & news.
                </label>
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
