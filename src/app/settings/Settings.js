import React, { Component } from "react";
import cookie from "js-cookie";

import * as api from "../apiActions";
import DeleteAccountModal from "./DeleteAccountModal";

const ERRORS = { REQUIRED: "Required", INVALID: "Invalid" };

class Settings extends Component {
  state = {
    showModal: false,
    isSuccess: false,
    profile: { name: "", email: "", avatar_url: "", username: "", email_notification: "" },
    errors: { email: undefined, name: undefined },
  };

  // Lifecylce methods
  componentDidMount() {
    this.fetchUserProfile();
  }

  // Validation helpers
  validateEmail = email => {
    const isValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const validMessage = !isValid ? ERRORS.INVALID : undefined;
    return email.length === 0 ? ERRORS.REQUIRED : validMessage;
  };

  validateName = name => {
    return name.length === 0 ? ERRORS.REQUIRED : undefined;
  };

  // Event listeners
  onOpenModal = () => this.setState({ showModal: true });

  onCloseModal = () => this.setState({ showModal: false });

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
        isLoading: true,
        isSuccess: false,
      },
      () => this.updateUserProfile(),
    );
  };

  // API methods
  fetchUserProfile = () => {
    api.fetchUserProfile().then(({ data }) => {
      this.setState({ profile: { ...this.state.profile, ...data } });
    });
  };

  updateUserProfile = () => {
    const { profile } = this.state;
    api
      .updateUserProfile(profile)
      .then(({ data }) => {
        this.setState({ profile: { ...profile, ...data }, isLoading: false, isSuccess: true });
      })
      .catch(this.handleError);
  };

  deleteUserProfile = () => {
    api.deleteUserProfile().then(() => {
      cookie.remove("token");
      cookie.remove("user");
      this.props.history.push("/");
    });
  };

  handleError = error => {
    console.error(error);
    this.setState({ isLoading: false, isSuccess: false });
  };

  render() {
    const { profile, isLoading, isSuccess } = this.state;

    return (
      <div className="container container--narrow my-5 px-4">
        <DeleteAccountModal
          isOpen={this.state.showModal}
          onCancel={this.onCloseModal}
          onConfirm={this.deleteUserProfile}
        />
        <h1 className="mb-4">Settings</h1>
        <form onSubmit={this.onSubmit} className="border rounded px-3 py-4 mb-3">
          <h5 className="font-weight-light py-1">My Details</h5>
          <hr />
          <div className="row mt-5">
            <div className="col-1">
              <small className="text-muted">Name</small>
            </div>
            <div className="col-11">
              <input
                name="name"
                onChange={this.onChange}
                className="small border-0 py-2 w-100"
                value={profile.name}
              />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Avatar</small>
            </div>
            <div className="col-11">
              <img
                className="rounded rounded-circle"
                style={{ width: "60px", height: "60px" }}
                src={profile.avatar_url}
                alt={profile.name}
              />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Email</small>
            </div>
            <div className="col-11">
              <input
                className="small border-0 py-2 w-100"
                type="email"
                name="email"
                onChange={this.onChange}
                value={profile.email}
              />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Username</small>
            </div>
            <div className="col-11">
              <input
                className="small border-0 py-2 w-100"
                name="username"
                onChange={this.onChange}
                value={profile.username}
              />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Newsletter</small>
            </div>
            <div className="col-11">
              <div className="d-flex align-items-center my-1">
                <input
                  className="small border-0 py-2"
                  type="checkbox"
                  name="email_notification"
                  onChange={() => this.onToggle("email_notification")}
                  checked={profile.email_notification}
                />
                <label className="ml-2 small m-0 text-muted font-weight-medium">
                  Notify me about upcoming flashcards & news.
                </label>
              </div>
              <hr />
            </div>
          </div>
          <div className="d-flex align-items-center mt-2">
            <button
              className="btn btn-outline-primary btn-sm font-weight-medium px-2"
              type="submit"
              disabled={isLoading}
            >
              Update my profile
            </button>
            {isLoading && <small className="text-uppercase text-muted ml-2">💾 Saving...</small>}
            {isSuccess && <small className="text-uppercase text-muted ml-2">👌 Updated!</small>}
          </div>
        </form>
        <div className="border rounded p-3 d-flex align-items-center justify-content-between">
          <div className="d-flex flex-column justify-content-center">
            <span className="font-weight-medium m-0">Delete my account</span>
            <span className="text-muted small">
              Need a break from flashcards? You can remove your account here.
            </span>
          </div>
          <button onClick={this.onOpenModal} className="btn btn-sm btn-outline-danger px-2">
            Delete account
          </button>
        </div>
      </div>
    );
  }
}

export default Settings;
