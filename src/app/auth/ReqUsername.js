import React, { Component } from "react";
import Modal from "react-modal";
import cookie from "js-cookie";

import Octicon from "../../components/Octicon";
import Emoji from "../../components/Emoji";
import isAuthenticated from "../utils/isAuthenticated";

const CheckMark = ({ hidden }) => (
  <i
    className="fas fa-check text-success mr-2"
    style={{ visibility: hidden ? "hidden" : "visible" }}
  />
);

const UsernameModal = ({ profile, isOpen, onClose, onChange }) => {
  return (
    <Modal isOpen={isOpen} className="loginModal" overlayClassName="loginModal-overlay">
      <button className="loginModal-close btn btn-reset p-2" onClick={onClose}>
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
              src={profile.avatar_url}
              className="profile-image rounded rounded"
              alt={profile.name}
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
            onChange={onChange}
            value={profile.username || ""}
          />
          <div className="text-dark small mt-2 font-weight-medium">
            We need a username to create your profile page. Your profile page will be public for
            other users to see.
          </div>
          <div className="text-dark small mt-2 font-weight-medium">
            <strong>We care about your privacy.</strong> If you don't want to have a public profile,
            you can delete your account now. No sweat.
          </div>
        </div>
      </div>
      <div className="px-4 my-4 d-flex flex-column flex-sm-row align-items-center justify-content-between">
        <button className="btn btn-primary btn-sm px-3">Create profile</button>
        <button className="btn btn-sm text-muted">I don't want a public profile</button>
      </div>
    </Modal>
  );
};

class ReqUsername extends Component {
  state = { showModal: true, username: "" };

  onChange = e => this.setState({ username: e.target.value });

  onClose = () => this.setState({ showModal: false });

  render() {
    const { showModal } = this.state;
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : null;

    if (user !== null && !user.username) {
      return (
        <UsernameModal
          isOpen={showModal}
          profile={user}
          onChange={this.onChange}
          onClose={this.onClose}
        />
      );
    }

    return false;
  }
}

export default ReqUsername;
