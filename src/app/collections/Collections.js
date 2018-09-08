import React, { Component } from "react";

import config from "../../config";
import * as api from "../apiActions";
import * as analytics from "../../components/GoogleAnalytics";
import Octicon from "../../components/Octicon";
import { setSavedDecks, getSavedDecks } from "../utils/savedDecks";
import SkillProgress from "../decks/SkillProgress";
import FeedbackForm from "../decks/FeedbackForm";
import DeckItem from "../decks/DeckItem";

class Decks extends Component {
  state = {
    collection: {},
    decks: [],
    isLoading: false,
    isError: false,
    savedDecks: [],
  };

  componentWillMount() {
    const { collectionId } = this.props.match.params;
    this.fetchCollection(collectionId);
    this.setState({ savedDecks: getSavedDecks() });
  }

  onToggleSave = (event, deck) => {
    event.preventDefault();

    analytics.logSaveDeckAction(this.isSaved(deck.id), deck.name);

    this.saveDeck(deck);
  };

  sortDecks = decks => [...decks].sort((a, b) => b.new - a.new);

  fetchCollection = id => {
    api.fetchCollection(id).then(
      ({ data }) => {
        this.setState({ collection: data });
        this.fetchDecks(data);
      },
      error => console.error(error),
    );
  };

  fetchDecks = collection => {
    api.fetchDecks(collection.id).then(
      ({ data }) => {
        this.setState({ decks: this.sortDecks(data), isLoading: false });
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
  };

  saveDeck = deck => {
    const savedDecks = this.isSaved(deck.id)
      ? this.state.savedDecks.filter(el => el !== deck.id)
      : [...this.state.savedDecks, deck.id];

    this.setState({ savedDecks }, () => setSavedDecks(savedDecks));
  };

  isSaved = id => this.state.savedDecks.includes(id);

  render() {
    const { location } = this.props;
    const { collection, decks, isLoading, isError } = this.state;

    if (isLoading) {
      return (
        <div className="container p-4 my-5">
          <div className="mb-5">
            <h1 className="m-0">Flashcards for Developers</h1>
            <p>A curated list of flashcards to boost your professional skills</p>
          </div>
          <h1 className="text-secondary">Loading decks...</h1>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="container p-4 my-5">
          <div className="mb-5">
            <h1 className="m-0">Flashcards for Developers</h1>
            <p>A curated list of flashcards to boost your professional skills</p>
          </div>
          <div className="text-center mt-3">
            <h1 className="text-dark">Unable to load request</h1>
            <p>Please try again or contact us.</p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="container container--full px-4 my-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <div className="mb-3">
              <h1 className="m-0">{collection.name}</h1>
              <p className="m-0">{collection.description}</p>
            </div>
            <div
              className="bg-light rounded p-3 mb-2 border border-secondary d-flex align-items-center"
              style={{ minWidth: "260px", minHeight: "90px" }}
            >
              <SkillProgress decks={decks} />
            </div>
          </div>
          {decks.length > 0 ? (
            <div className="row pt-4">
              {decks.map(deck => (
                <DeckItem
                  deck={deck}
                  key={deck.id}
                  location={location}
                  isSaved={this.isSaved(deck.id)}
                  onToggleSave={this.onToggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="w-100 text-center my-5 pb-5" style={{ minHeight: "30vh" }}>
              <div className="h4" style={{ opacity: 0.8 }}>
                This collection is currently empty.
              </div>
              <div className="mb-4">Let us know what topics you want to see.</div>
              <div className="row d-flex justify-content-center mt-2 mb-5">
                <a
                  className="text-dark d-flex align-items-center btn btn-outline-dark px-4"
                  href={config.airtableSuggestionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ borderRadius: "999px" }}
                >
                  <Octicon className="d-flex mr-2" name="plus" />
                  <span>Suggest a deck</span>
                </a>
              </div>
            </div>
          )}
          <div className="row mt-5">
            <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 mt-5">
              <FeedbackForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Decks;
