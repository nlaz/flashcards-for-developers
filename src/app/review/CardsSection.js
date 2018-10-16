import React, { Component } from "react";
import marked from "marked";

import Octicon from "../../components/Octicon";

class CardsSection extends Component {
  render() {
    const { cards } = this.props;
    console.log(cards);
    return (
      <div className="cards-section bg-white rounded my-4" style={{ border: "1px solid #e9e9e9" }}>
        {cards &&
          cards.length > 0 &&
          cards.map(card => (
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
    );
  }
}

export default CardsSection;
