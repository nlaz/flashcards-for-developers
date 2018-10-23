import React, { Component } from "react";
import Modal from "react-modal";

import Octicon from "../../components/Octicon";
import * as api from "../../app/apiActions";

const CountBadge = ({ count }) =>
  count > 0 ? (
    <div className="badge badge-dark position-absolute m-3" style={{ top: 0, right: 0 }}>
      + {count}
    </div>
  ) : (
    false
  );

class AddCardsModal extends Component {
  state = { front: "", back: "", toggleOption: false, addedCount: 0 };

  onToggle = e => this.setState({ toggleOption: !this.state.toggleOption });

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { deck } = this.props;
    const { front, back } = this.state;
    api
      .createCard({ front, back, deck: deck.id })
      .then(this.handleSuccess)
      .catch(error => console.error(error));
  };

  handleSuccess = response => {
    if (this.state.toggleOption) {
      this.setState({ front: "", back: "", addedCount: this.state.addedCount + 1 });
      this.props.onAddCard(response.data);
    } else {
      this.setState({ front: "", back: "" });
      this.props.onAddCard(response.data);
      this.props.onClose();
    }
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
          <div className="p-3 position-relative">
            <CountBadge count={this.state.addedCount} />
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
              <span className="small text-muted">Submit and add another card</span>
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
