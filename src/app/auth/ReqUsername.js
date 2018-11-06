import React, { Component } from "react";
import Modal from "react-modal";
import cookie from "js-cookie";

import * as api from "../apiActions";
import Octicon from "../../components/Octicon";
import Emoji from "../../components/Emoji";
import isAuthenticated from "../utils/isAuthenticated";
import DeleteAccountModal from "../settings/DeleteAccountModal";

const CheckMark = ({ hidden }) => (
  <i
    className="fas fa-check text-success mr-2"
    style={{ visibility: hidden ? "hidden" : "visible" }}
  />
);

const ERRORS = { REQUIRED: "Required", INVALID: "Invalid" };

class ReqUsername extends Component {
  state = {
    showModal: true,
    showDeleteModal: false,
    isLoading: false,
    isSucess: false,
    username: "",
    errors: { username: "", form: "" },
  };

  componentDidMount() {
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};
    if (user.name) {
      this.setState({
        username: user.name
          .split(" ")
          .join("_")
          .toLowerCase(),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};
    if (prevProps.location !== this.props.location) {
      if (this.props.location.pathname !== `/${user.username}`) {
        this.setState({ isSuccess: false });
      }
    }
  }

  onChange = e => this.setState({ username: e.target.value });

  onClose = () => this.setState({ showModal: false });

  onOpenDeleteModal = () => this.setState({ showDeleteModal: true });

  onCloseDeleteModal = () => this.setState({ showDeleteModal: false });

  onSubmit = () => {
    const { username, errors } = this.state;

    this.setState(
      {
        errors: {
          ...errors,
          username: this.validateUsername(username || ""),
        },
        isLoading: true,
        isSuccess: false,
      },
      () => this.updateProfile(),
    );
  };
  // Validation helpers
  validateUsername = username => {
    const illegalChars = /\W/; // allow letters, numbers, and underscores
    const isValid = !illegalChars.test(username) && username.length >= 4 && username.length <= 15;
    const validMessage = !isValid ? ERRORS.INVALID : undefined;
    return username.length === 0 ? ERRORS.REQUIRED : validMessage;
  };

  updateProfile = () => {
    const { username, errors } = this.state;
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};
    const { name, email, email_notification } = user;

    if (!errors.email && !errors.name && !errors.username) {
      api
        .updateProfile({ username, name, email, email_notification })
        .then(({ data }) => {
          cookie.set("user", data);
          this.setState({
            username: data.username,
            errors: { username: "" },
            isLoading: false,
            isSuccess: true,
          });
          this.props.history.push(`/${data.username}`);
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
    const { status } = error.response;
    const formMessage =
      status === 400
        ? "Username already exists. Try a different username."
        : "Something went wrong with the request. Please contact us.";
    this.setState({ errors: { ...this.state.errors, form: formMessage } });
  };

  render() {
    const { showModal, username, isSuccess } = this.state;
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : null;

    if (user !== null && !user.username) {
      return (
        <Modal isOpen={showModal} className="loginModal" overlayClassName="loginModal-overlay">
          <DeleteAccountModal
            isOpen={this.state.showDeleteModal}
            onCancel={this.onCloseDeleteModal}
            onConfirm={this.deleteUserProfile}
          />
          <button className="loginModal-close btn btn-reset p-2" onClick={this.onClose}>
            <Octicon name="x" />
          </button>
          <div className="p-4 rounded-top bg-blueLight">
            <div className="mx-auto" style={{ maxWidth: "380px" }}>
              <h5 className="text-center mb-3">
                Create Your Profile Page
                <Emoji value="🎉" className="ml-2" />
              </h5>
              <div className="d-flex align-items-center mb-2">
                <img
                  src={user.avatar_url}
                  className="profile-image rounded rounded"
                  alt={user.name}
                  style={{ width: "80px", height: "80px" }}
                />
                <div className="ml-3">
                  <div className="font-weight-medium" style={{ fontSize: ".9em" }}>
                    <CheckMark />
                    View and edit your profile
                  </div>
                  <div className="font-weight-medium" style={{ fontSize: ".9em" }}>
                    <CheckMark />
                    Mission control for your studying
                  </div>
                  <div className="font-weight-medium" style={{ fontSize: ".9em" }}>
                    <CheckMark />
                    See and share your progress
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4 px-4 mb-3" style={{ maxWidth: "430px" }}>
            <div className="form-group">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="small font-weight-bold m-0" style={{ opacity: 0.85 }}>
                  Choose a unique username
                </label>
              </div>
              <input
                type="text"
                name="username"
                className="form-control form-control-sm"
                placeholder="Which username do you like?"
                onChange={this.onChange}
                value={username || ""}
              />
              <div className="text-dark small mt-2 font-weight-medium">
                We need a username to create your profile page. Your profile page will be public for
                other users to see.
              </div>
              <div className="text-dark small mt-2 font-weight-medium">
                <strong>We care about your privacy.</strong> If you don't want to have a public
                profile, you can delete your account now. No sweat.
              </div>
            </div>
          </div>
          <div className="px-4 my-4 d-flex flex-column flex-sm-row align-items-center justify-content-between">
            <button
              onClick={this.onSubmit}
              className="btn btn-primary btn-sm px-3"
              disabled={username.length === 0}
            >
              Create profile
            </button>
            <button onClick={this.onOpenDeleteModal} className="btn btn-sm text-muted">
              I don't want a public profile
            </button>
          </div>
        </Modal>
      );
    }

    if (isSuccess) {
      return (
        <div className="p-2 w-100 alert alert-success">
          <div className="container container--full">
            <strong>Success!</strong> Welcome to your new profile page. Have a look around.
          </div>
        </div>
      );
    }

    return false;
  }
}

export default ReqUsername;
