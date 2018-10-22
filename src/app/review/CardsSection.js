import React, { Component } from "react";
import marked from "marked";

import Octicon from "../../components/Octicon";
import AddCardsModal from "./AddCardsModal";

class CardsSection extends Component {
  state = { showModal: false };

  onOpenModal = () => this.setState({ showModal: true });

  onCloseModal = () => this.setState({ showModal: false });

  render() {
    const { cards } = this.props;
    return (
      <div className="my-2">
        <AddCardsModal
          deck={this.props.deck}
          isOpen={this.state.showModal}
          onClose={this.onCloseModal}
        />
        <div className="text-right">
          <button onClick={this.onOpenModal} className="btn btn-success btn-sm text-white">
            + Add Card
          </button>
        </div>
        {cards.length > 0 && (
          <div
            className="cards-section bg-white rounded my-2"
            style={{ border: "1px solid #e9e9e9" }}
          >
            {cards.map(card => (
              <div
                key={card.id}
                className="card-row d-flex pl-3 pr-2 py-2"
                style={{ borderBottom: "1px solid #e9e9e9" }}
              >
                <div className="row w-100">
                  <div className="col-md-6">
                    <div dangerouslySetInnerHTML={{ __html: marked(card.front) }} />
                  </div>
                  <div className="col-0 col-md-6">
                    <div dangerouslySetInnerHTML={{ __html: marked(card.back) }} />
                  </div>
                </div>
                <div className="ml-2">
                  <Octicon name="kebab-horizontal" />
                </div>
              </div>
            ))}
          </div>
        )}
        {cards.length === 0 && (
          <div className="blankslate py-5 my-2">
            <Octicon name="note" height="32" fill="#99a0a8" className="mx-2" />
            <Octicon name="package" height="32" fill="#99a0a8" className="mx-2" />
            <Octicon name="graph" height="32" fill="#99a0a8" className="mx-2" />
            <h1 className="m-0">No cards available.</h1>
            <p>This deck does not have any flashcards. Add a few cards to get started.</p>
            <button onClick={this.onOpenModal} className="btn btn-success btn-sm text-white px-3">
              + Add Card
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default CardsSection;
