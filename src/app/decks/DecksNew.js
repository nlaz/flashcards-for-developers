import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import * as api from "../apiActions";
import Octicon from "../../components/Octicon";
import isProMember from "../utils/isProMember";

const STATUS_TYPES = { PRIVATE: "private", PUBLIC: "public" };

class DecksNew extends Component {
  state = { name: "", description: "", deck: {}, status: STATUS_TYPES.PUBLIC, isRedirect: false };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { name, description, status } = this.state;

    if (status === STATUS_TYPES.PUBLIC || isProMember()) {
      api
        .createDeck({ name, description, status })
        .then(response => this.setState({ isRedirect: true, deck: response.data }))
        .catch(error => console.log(error));
    }
  };

  render() {
    const { name, status, description, deck, isRedirect } = this.state;

    if (isRedirect && Object.keys(deck).length > 0) {
      return <Redirect to={`/decks/${deck.id}/cards`} />;
    }

    return (
      <div className="container container--narrow py-5">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="mb-4">
              <h1 className="m-0">Create a new deck</h1>
              <p className="deck-description p-0">
                A deck is a collection of related flashcards, typically covering a single topic.
              </p>
              <hr />
            </div>
            <form onSubmit={this.onSubmit}>
              <div className="form-group mb-4">
                <label className="small font-weight-bold mb-1">Enter a deck name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder={`e.g. "JavaScript Common Methods"`}
                  onChange={this.onChange}
                  value={name}
                />
              </div>
              <div className="form-group mb-3">
                <label className="small font-weight-bold mb-1">
                  Enter a deck description <span className="text-muted">(optional)</span>
                </label>
                <textarea
                  type="text"
                  name="description"
                  className="form-control"
                  placeholder={`e.g. "A collection of commonly used JavaScripts functions."`}
                  onChange={this.onChange}
                  value={description}
                />
              </div>
              <hr />
              <div className="d-flex align-items-center my-3">
                <input
                  type="radio"
                  className="mr-2"
                  checked={status === STATUS_TYPES.PUBLIC}
                  onChange={() => this.setState({ status: STATUS_TYPES.PUBLIC })}
                />
                <Octicon name="repo" width={24} height={30} fill="#959da5" className="d-flex" />
                <label className="d-flex flex-column justify-content-center ml-2 my-0">
                  <span
                    className="font-weight-medium mt-1"
                    style={{ lineHeight: "1em", fontSize: ".9em" }}
                  >
                    Public deck
                  </span>
                  <small className="text-muted">Anyone can see and study to this deck.</small>
                </label>
              </div>
              <div className="d-flex align-items-center my-3">
                <input
                  type="radio"
                  className="mr-2"
                  checked={status === STATUS_TYPES.PRIVATE}
                  onChange={() => this.setState({ status: STATUS_TYPES.PRIVATE })}
                />
                <Octicon name="lock" width={24} height={30} fill="#b9ad87" className="d-flex" />
                <label className="d-flex flex-column justify-content-center ml-2 my-0">
                  <div className="d-flex">
                    <span
                      className="font-weight-medium mt-1 mr-2"
                      style={{ lineHeight: "1em", fontSize: ".9em" }}
                    >
                      Private deck
                    </span>
                    <span className="badge badge-warning d-flex align-items-center p-0">
                      <Octicon
                        name="star"
                        className="d-flex align-items-center ml-1"
                        width={13}
                        height={13}
                      />
                      <small
                        className="font-weight-bold pr-1 py-1 m-0"
                        style={{ paddingLeft: "1px" }}
                      >
                        PRO
                      </small>
                    </span>
                  </div>
                  <small className="text-muted">
                    You are the only one who can see and study to this deck.
                  </small>
                </label>
              </div>
              <hr />
              <div className="text-muted mb-4" style={{ lineHeight: "1em", fontSize: ".8em" }}>
                Please read our{" "}
                <Link className="text-muted text-underline" to="pages/community-guidelines">
                  community guidelines
                </Link>{" "}
                before creating your deck.
              </div>
              <button
                type="submit"
                className="btn btn-success btn-sm font-weight-medium px-3 py-1"
                disabled={!isProMember() && status === STATUS_TYPES.PRIVATE}
              >
                Create deck
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default DecksNew;
