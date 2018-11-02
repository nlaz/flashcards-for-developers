import React, { Component } from "react";
import cookie from "js-cookie";

import isAuthenticated from "../utils/isAuthenticated";
import DeleteAccountModal from "./DeleteAccountModal";

class Settings extends Component {
  state = {
    showModal: false,
    profile: { name: "", email: "", avatar_url: "", username: "", email_notification: "" },
    errors: { email: undefined, name: undefined },
  };

  onOpenModal = () => this.setState({ showModal: true });

  onCloseModal = () => this.setState({ showModal: false });

  render() {
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};

    return (
      <div className="container container--narrow my-5 px-4">
        <DeleteAccountModal
          isOpen={this.state.showModal}
          onCancel={this.onCloseModal}
          onConfirm={this.onDelete}
        />
        <h1 className="mb-4">Settings</h1>
        <form className="border rounded px-3 py-4 mb-3">
          <h5 className="font-weight-light py-1">My Details</h5>
          <hr />
          <div className="row mt-5">
            <div className="col-1">
              <small className="text-muted">Name</small>
            </div>
            <div className="col-11">
              <input className="small border-0 py-2 w-100" value={user.name} />
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
                src={user.avatar_url}
                alt={user.name}
              />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Email</small>
            </div>
            <div className="col-11">
              <input className="small border-0 py-2 w-100" value={user.email} />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Username</small>
            </div>
            <div className="col-11">
              <input className="small border-0 py-2 w-100" value={user.username} />
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <small className="text-muted">Newsletter</small>
            </div>
            <div className="col-11">
              <input className="small border-0 py-2 w-100" value={user.email_notification} />
              <hr />
            </div>
          </div>
          <button
            className="btn btn-outline-primary btn-sm font-weight-medium px-2 mt-2"
            type="submit"
          >
            Update my profile
          </button>
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
