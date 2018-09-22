import React, { Component } from "react";
import { Link } from "react-router-dom";

import config from "../../config";
import isAuthenticated from "../utils/isAuthenticated";
import * as api from "../apiActions";
import * as analytics from "../../components/GoogleAnalytics";
import * as localStorage from "../utils/localStorage";

import Octicon from "../../components/Octicon";
import SkillProgress from "../home/SkillProgress";
import FeedbackForm from "../home/FeedbackForm";
import DeckItem from "../home/DeckItem";

class Collections extends Component {
  state = {
    collection: {},
    decks: [],
    isLoading: false,
    isError: false,
    savedDecks: [],
    studyProgress: [],
  };

  componentWillMount() {
    const { params } = this.props.match;

    if (this.isSavedDecksPage()) {
      this.fetchSavedDecksCollection();
    } else {
      this.fetchSavedDecks();
      this.fetchCollection(params.collectionId);
    }

    this.fetchStudyProgress();
  }

  onToggleSave = (event, deck) => {
    event.preventDefault();
    const isSaved = this.isSaved(deck.id);

    analytics.logSaveDeckAction(deck.name, isSaved);

    this.saveDeck(deck, isSaved);
  };

  sortDecks = decks => [...decks].sort((a, b) => b.new - a.new);

  fetchCollection = id => {
    api.fetchCollection(id).then(
      ({ data }) => {
        this.setState({ collection: data, decks: this.sortDecks(data.decks), isLoading: false });
      },
      error => console.error(error),
    );
  };

  fetchSavedDecks = () => {
    if (isAuthenticated()) {
      api.fetchSavedDecks().then(({ data }) => {
        this.setState({ savedDecks: data });
      });
    } else {
      this.setState({ savedDecks: localStorage.getSavedDecks() });
    }
  };

  fetchSavedDecksCollection = () => {
    if (isAuthenticated()) {
      api.fetchSavedDecks().then(({ data }) => {
        this.setState({
          savedDecks: data,
          collection: { name: "Saved decks", id: "saved" },
          decks: this.sortDecks(data),
          isLoading: false,
        });
      });
    } else {
      const savedDecks = localStorage.getSavedDecks();
      if (savedDecks.length > 0) {
        api.fetchDecksById(savedDecks).then(({ data }) => {
          this.setState({
            savedDecks: data,
            collection: { name: "Saved decks", id: "saved" },
            decks: this.sortDecks(data),
            isLoading: false,
          });
        });
      }
    }
  };

  fetchStudyProgress = () => {
    if (isAuthenticated()) {
      api
        .fetchStudyProgress()
        .then(response => this.setState({ studyProgress: response.data }))
        .catch(this.handleError);
    } else {
      this.setState({ studyProgress: localStorage.getStudyProgress() });
    }
  };

  saveDeck = (deck, isSaved) => {
    const { decks } = this.state;
    if (isAuthenticated()) {
      api
        .toggleSavedDeck(deck.id, isSaved)
        .then(({ data }) =>
          this.setState({ savedDecks: data, decks: this.isSavedDecksPage() ? data : decks }),
        )
        .catch(this.handleError);
    } else {
      this.setState({ savedDecks: localStorage.toggleSavedDeck(deck.id, isSaved) });
    }
  };

  isSaved = id => this.state.savedDecks.find(el => el.id === id || el === id);
  isSavedDecksPage = () => this.props.match.params.collectionId === "saved";
  getDeckProgress = id => this.state.studyProgress.find(el => el.deck === id);

  render() {
    const { location } = this.props;
    const { collection, decks, studyProgress, isLoading, isError } = this.state;

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
      <div className="container container--full px-4 my-5">
        <div className="d-flex flex-column-reverse flex-lg-row justify-content-between align-items-lg-end">
          <div className="mb-2 mt-3">
            <h1 className="m-0">{collection.name}</h1>
            {collection.description && <p className="m-0">{collection.description}</p>}
            {this.isSavedDecksPage() && (
              <Link
                className="btn btn-dark font-weight-medium text-uppercase d-block d-sm-inline-block mt-2"
                style={{ borderRadius: "999px", fontSize: ".75em", padding: "5px 25px" }}
                onClick={() => analytics.logUserAction("Clicked 'Study now' button")}
                to={`/collections/${collection.id}/review`}
              >
                Study Now
              </Link>
            )}
          </div>
          <div
            className="bg-light rounded p-3 mb-2 border border-secondary d-flex align-items-center"
            style={{ minWidth: "260px", minHeight: "90px" }}
          >
            <SkillProgress decks={decks} studyProgress={studyProgress} />
          </div>
        </div>
        <hr className="m-0" style={{ opacity: 0.6 }} />
        {decks.length > 0 ? (
          <div className="row pt-4" style={{ minHeight: "40vh" }}>
            {decks.map(deck => (
              <DeckItem
                deck={deck}
                deckProgress={this.getDeckProgress(deck.id)}
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
    );
  }
}

Collections.defaultProps = {
  match: { params: {} },
};

export default Collections;
