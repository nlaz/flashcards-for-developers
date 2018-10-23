import React, { Component } from "react";

import * as api from "../../app/apiActions";
import Octicon from "../../components/Octicon";
import DeleteModal from "./DeleteModal";

class SettingsSection extends Component {
  state = {
    name: this.props.deck.name,
    description: this.props.deck.description,
    showModal: false,
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { deck } = this.props;
    const { name, description } = this.state;
    api
      .updateDeck({ deckId: deck.id, name, description })
      .then(response => this.props.onUpdateDeck(response.data))
      .catch(error => console.error(error));
  };

  onOpenModal = () => this.setState({ showModal: true });

  onCloseModal = () => this.setState({ showModal: false });

  onDelete = () => {
    const { deck } = this.props;
    api
      .deleteDeck(deck.id)
      .then(response => this.props.onDeleteDeck(response.data))
      .catch(error => console.error(error));
  };

  render() {
    const { name, description } = this.state;

    return (
      <div className="py-2">
        <DeleteModal
          isOpen={this.state.showModal}
          onCancel={this.onCloseModal}
          onConfirm={this.onDelete}
        />
        <form onSubmit={this.onSubmit} className="border rounded py-4 px-3 mb-3">
          <h2 className="m-0" style={{ fontSize: "1.25em" }}>
            Settings
          </h2>
          <p className="text-muted small p-0">Update information and settings for this deck.</p>
          <div className="form-group mb-4">
            <label className="small font-weight-bold mb-1">Title</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Add a title for this deck..."
              onChange={this.onChange}
              value={name}
            />
          </div>
          <div className="form-group mb-4">
            <label className="small font-weight-bold mb-1">
              Description <span className="text-muted">(optional)</span>
            </label>
            <textarea
              type="text"
              name="description"
              className="form-control"
              placeholder="Add a short description for this deck..."
              onChange={this.onChange}
              value={description}
            />
          </div>
          <div className="d-flex align-items-center mb-3 mt-4">
            <div>
              <Octicon name="lock" width={24} height={30} fill="#b9ad87" className="d-flex" />
            </div>
            <div className="d-flex flex-column justify-content-center ml-2">
              <span className="font-weight-medium" style={{ lineHeight: "1em" }}>
                Private deck
              </span>
              <small className="text-muted">
                You are the only one who can see and study to this deck.
              </small>
            </div>
          </div>
          <button
            className="btn btn-outline-primary btn-sm font-weight-medium px-2 mt-2"
            type="submit"
          >
            Update this deck
          </button>
        </form>
        <div className="border rounded p-3 d-flex align-items-center justify-content-between">
          <div className="d-flex flex-column justify-content-center">
            <span className="font-weight-medium m-0">Delete this deck</span>
            <span className="text-muted small">
              Deleting a deck will permanently remove all of its cards.
            </span>
          </div>
          <button onClick={this.onOpenModal} className="btn btn-sm btn-outline-danger px-2">
            Delete this deck
          </button>
        </div>
      </div>
    );
  }
}

export default SettingsSection;
