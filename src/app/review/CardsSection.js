import React, { Component } from "react";
import marked from "marked";
import cookie from "js-cookie";
import Tooltip from "rc-tooltip";

import Octicon from "../../components/Octicon";
import AddCardsModal from "./AddCardsModal";
import * as api from "../../app/apiActions";
import isAuthenticated from "../../app/utils/isAuthenticated";
import config from "../../config";

const CardTooltip = ({ isOwner, onDelete }) => (
  <div style={{ maxWidth: "100px" }}>
    {isOwner && (
      <button onClick={onDelete} className="text-left btn btn-reset btn-sm w-100">
        Delete Card
      </button>
    )}
    <a
      href={config.airtableReportUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-left text-black btn btn-sm btn-reset w-100"
    >
      Report Card
    </a>
  </div>
);

class CardsSection extends Component {
  state = { showModal: false, cards: this.props.cards };

  onOpenModal = () => this.setState({ showModal: true });

  onCloseModal = () => this.setState({ showModal: false });

  onAddCard = card => this.setState({ cards: [...this.state.cards, card] });

  onDeleteCard = cardId => {
    api
      .deleteCard(cardId)
      .then(response => this.setState({ cards: this.state.cards.filter(el => el.id !== cardId) }))
      .catch(error => console.log(error));
  };

  render() {
    const { cards } = this.state;
    const { deck } = this.props;

    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};
    const isOwner = deck.author === user.id;

    return (
      <div className="my-2">
        <AddCardsModal
          deck={this.props.deck}
          isOpen={this.state.showModal}
          onClose={this.onCloseModal}
          onAddCard={this.onAddCard}
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
                  <Tooltip
                    placement="bottomRight"
                    trigger={["click"]}
                    ref={c => {
                      this.tooltip = c;
                    }}
                    overlay={
                      <CardTooltip isOwner={isOwner} onDelete={() => this.onDeleteCard(card.id)} />
                    }
                    id="tooltip-white"
                  >
                    <button className="btn btn-sm btn-reset">
                      <Octicon name="kebab-horizontal" className="d-flex" />
                    </button>
                  </Tooltip>
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
