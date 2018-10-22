import React, { Component } from "react";
import Modal from "react-modal";

import Octicon from "../../components/Octicon";
import * as api from "../../app/apiActions";

class AddCardsModal extends Component {
  state = { front: "", back: "", toggleOption: false };

  onToggle = e => this.setState({ toggleOption: !this.state.toggleOption });

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { front, back } = this.state;
    api
      .createCard({ front, back })
      .then(response => console.log(response))
      .catch(error => console.error(error));
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { front, back, toggleOption } = this.state;
    return (
      <Modal isOpen={isOpen} className="loginModal" overlayClassName="loginModal-overlay">
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <h1 className="m-0" style={{ fontSize: "1.125em" }}>
            Add Cards
          </h1>
          <button className="btn btn-sm btn-reset p-2" onClick={onClose}>
            <Octicon name="x" className="d-flex" />
          </button>
        </div>
        <hr className="m-0" />

        <form onSubmit={this.onSubmit}>
          <div className="p-3">
            <div className="form-group mb-2">
              <label className="small font-weight-bold mb-1">Front</label>
              <textarea
                type="text"
                name="front"
                className="form-control"
                placeholder="Add to the card front..."
                onChange={this.onChange}
                style={{ height: "92px", fontSize: ".8em" }}
                value={front}
              />
            </div>
            <div className="form-group mb-2">
              <label className="small font-weight-bold mb-1">Back</label>
              <textarea
                type="text"
                name="back"
                className="form-control"
                placeholder="Add to the card back..."
                onChange={this.onChange}
                style={{ height: "92px", fontSize: ".8em" }}
                value={back}
              />
            </div>
          </div>
          <hr className="m-0" />
          <div className="d-flex align-items-center justify-content-between px-3 py-2">
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                onChange={this.onToggle}
                checked={toggleOption}
                className="mr-1 mb-1"
              />
              <span className="small text-muted">Save and add another card</span>
            </div>
            <div>
              <button onClick={onClose} className="btn btn-sm btn-secondary mr-2">
                Cancel
              </button>
              <button className="btn btn-sm btn-primary" type="submit">
                Add Card
              </button>
            </div>
          </div>
        </form>
      </Modal>
    );
  }
}

export default AddCardsModal;
