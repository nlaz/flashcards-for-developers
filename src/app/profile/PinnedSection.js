import React, { Component } from "react";

import DeckItem from "../home/DeckItem";

class PinnedSection extends Component {
  isPinned = id => this.props.pinnedDecks.find(el => el.id === id);
  getDeckProgress = id => this.props.studyProgress.find(el => el.deck === id);

  render() {
    const { pinnedDecks } = this.props;
    return (
      <div className="container container--full px-4 my-5">
        <div className="row">
          {pinnedDecks.map(item => (
            <DeckItem
              key={item.id}
              deck={item}
              isPinned={this.isPinned(item.id)}
              deckProgress={this.getDeckProgress(item.id)}
              onTogglePin={this.onTogglePin}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default PinnedSection;
