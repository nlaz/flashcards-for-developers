import React, { Component } from "react";
import cookie from "js-cookie";

import * as api from "../apiActions";
import Emoji from "../../components/Emoji";
import DeleteAccountModal from "./DeleteAccountModal";

const ERRORS = { REQUIRED: "Required", INVALID: "Invalid" };

class Settings extends Component {
  state = {
    showModal: false,
    isSuccess: false,
    profile: { name: "", email: "", avatar_url: "", username: "", email_notification: false },
    errors: { email: undefined, name: undefined },
  };

  // Lifecylce methods
  componentDidMount() {
    this.fetchProfile();
  }

  // Validation helpers
  validateUsername = username => {
    const illegalChars = /\W/; // allow letters, numbers, and underscores
    const isValid = !illegalChars.test(username) && username.length >= 4 && username.length <= 15;
    const validMessage = !isValid ? ERRORS.INVALID : undefined;
    return username.length === 0 ? ERRORS.REQUIRED : validMessage;
  };

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
    const { email, name, username } = profile;

    this.setState(
      {
        errors: {
          ...errors,
          username: this.validateUsername(username || ""),
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
  fetchProfile = () => {
    api.fetchProfile().then(({ data }) => {
      this.setState({ profile: { ...this.state.profile, ...data } });
    });
  };

  updateUserProfile = () => {
    const { profile, errors } = this.state;
    if (!errors.email && !errors.name && !errors.username) {
      api
        .updateProfile(profile)
        .then(({ data }) => {
          cookie.set("user", data);
          this.setState({
            profile: { ...profile, ...data },
            errors: { name: "", email: "", username: "" },
            isLoading: false,
            isSuccess: true,
          });
        })
        .catch(this.handleError);
    } else {
      this.setState({ isLoading: false, isSuccess: false });
    }
  };

  deleteUserProfile = () => {
    api.deleteProfile().then(() => {
      cookie.remove("token");
      cookie.remove("user");
      this.props.history.push("/");
    });
  };

  handleError = error => {
    this.setState({
      errors: { ...this.state.errors, form: error },
      isLoading: false,
      isSuccess: false,
    });
  };

  render() {
    const { profile, errors, isLoading, isSuccess } = this.state;

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
            <div className="col-sm-2 col-lg-1">
              <small className={errors.name ? "text-danger" : "text-muted"}>Name</small>
            </div>
            <div className="col-sm-10 col-lg-11">
              <div className="d-flex align-items-center">
                <input
                  name="name"
                  onChange={this.onChange}
                  className="small border-0 py-2 w-100"
                  value={profile.name}
                />
                {errors.name && (
                  <small className="text-danger text-uppercase ml-2 shake--error">
                    {errors.name}
                  </small>
                )}
              </div>
              <hr className={errors.name ? "border-danger" : ""} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2 col-lg-1">
              <small className="text-muted">Avatar</small>
            </div>
            <div className="col-sm-10 col-lg-11">
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
            <div className="col-sm-2 col-lg-1">
              <small className={errors.email ? "text-danger" : "text-muted"}>Email</small>
            </div>
            <div className="col-sm-10 col-lg-11">
              <div className="d-flex align-items-center">
                <input
                  className="small border-0 py-2 w-100"
                  type="email"
                  name="email"
                  onChange={this.onChange}
                  value={profile.email}
                />
                {errors.email && (
                  <small className="text-danger text-uppercase ml-2 shake--error">
                    {errors.email}
                  </small>
                )}
              </div>
              <hr className={errors.email ? "border-danger" : ""} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2 col-lg-1">
              <small className={errors.username ? "text-danger" : "text-muted"}>Username</small>
            </div>
            <div className="col-sm-10 col-lg-11">
              <div className="d-flex align-items-center">
                <input
                  className="small border-0 py-2 w-100"
                  name="username"
                  onChange={this.onChange}
                  value={profile.username}
                />
                {errors.username && (
                  <small className="text-danger text-uppercase ml-2 shake--error">
                    {errors.username}
                  </small>
                )}
              </div>
              <hr className={errors.username ? "border-danger" : ""} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2 col-lg-1">
              <small className="text-muted">Newsletter</small>
            </div>
            <div className="col-sm-10 col-lg-11">
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
            {(errors.name || errors.email || errors.username || errors.form) && (
              <small className="text-uppercase text-danger ml-2">
                <Emoji value="🙀" /> Oh-oh! There has been an error...
              </small>
            )}
            {isLoading && (
              <small className="text-uppercase text-muted ml-2">
                <Emoji value="💾" /> Saving...
              </small>
            )}
            {isSuccess && (
              <small className="text-uppercase text-muted ml-2">
                <Emoji value="👌" /> Updated!
              </small>
            )}
          </div>
        </form>
        <div className="border rounded p-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
          <div className="d-flex flex-column justify-content-center">
            <span className="font-weight-medium m-0">Delete my account</span>
            <span className="text-muted small">
              Need a break from flashcards? You can remove your account here.
            </span>
          </div>
          <button onClick={this.onOpenModal} className="btn btn-sm btn-outline-danger px-2 my-2">
            Delete account
          </button>
        </div>
      </div>
    );
  }
}

export default Settings;
