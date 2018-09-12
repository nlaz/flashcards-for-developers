import React, { Component } from "react";
import { Link } from "react-router-dom";

import config from "../../config";
import isAuthenticated from "../utils/isAuthenticated";
import * as api from "../apiActions";
import * as analytics from "../../components/GoogleAnalytics";
import * as localStorage from "../utils/localStorage";

import CollectionItem from "../collections/CollectionItem";
import HabitTracker from "./HabitTracker";
import FeedbackForm from "./FeedbackForm";
import DeckItem from "./DeckItem";

class Decks extends Component {
  state = {
    newestRow: {},
    trendingRow: {},
    featuredRow: {},
    savedDecks: [],
    studyProgress: [],
    collections: [],
    isLoading: true,
    isError: false,
  };

  componentWillMount() {
    document.title = "Flashcards for Developers";

    this.fetchFeaturedCollection();
    this.fetchTrendingCollection();
    this.fetchNewestCollection();

    this.fetchSavedDecks();
    this.fetchStudyProgress();
    this.fetchCollections();
  }

  onToggleSave = (event, deck) => {
    event.preventDefault();
    const isSaved = this.isSaved(deck.id);

    analytics.logSaveDeckAction(deck.name, isSaved);

    this.saveDeck(deck, isSaved);
  };

  sortDecks = decks => [...decks].sort((a, b) => b.new - a.new);

  fetchDecks = collection => {
    api.fetchDecks(collection.id).then(
      ({ data }) => {
        this.setState({ decks: this.sortDecks(data), isLoading: false });
      },
      error => this.setState({ isError: true, isLoading: false }),
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

  fetchStudyProgress = () => {
    if (isAuthenticated()) {
      api
        .fetchStudyProgress()
        .then(response => this.setState({ studyProgress: response.data, isLoading: false }))
        .catch(this.handleError);
    } else {
      this.setState({ studyProgress: localStorage.getStudyProgress() });
    }
  };

  fetchFeaturedCollection = () => {
    api.fetchCollections("Featured").then(response => {
      this.setState({ featuredRow: response.data.pop() });
    });
  };

  fetchTrendingCollection = () => {
    api
      .fetchCollections("Trending")
      .then(response => this.setState({ trendingRow: response.data.pop() }));
  };

  fetchNewestCollection = () => {
    api
      .fetchCollections("Recently Added")
      .then(({ data }) => this.setState({ newestRow: data.pop() }));
  };

  fetchCollections = () => {
    api
      .fetchCollections()
      .then(response => this.setState({ collections: response.data }))
      .catch(this.handleError);
  };

  saveDeck = (deck, isSaved) => {
    if (isAuthenticated()) {
      api
        .toggleSavedDeck(deck.id, isSaved)
        .then(response => this.setState({ savedDecks: response.data }))
        .catch(this.handleError);
    } else {
      this.setState({ savedDecks: localStorage.toggleSavedDeck(deck.id, isSaved) });
    }
  };

  handleError = error => console.error(error);

  isSaved = id => this.state.savedDecks.includes(id);
  getDeckProgress = id => this.state.studyProgress.find(el => el.deck === id);

  render() {
    const { featuredRow, trendingRow, newestRow, collections, isLoading, isError } = this.state;

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
      <div className="my-5">
        <div className="container container--full px-4 my-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <div className="mb-3">
              <h1 className="m-0">Flashcards for Developers</h1>
              <p className="m-0">A curated list of flashcards to boost your professional skills</p>
            </div>
            <div
              className="bg-light rounded p-3 mb-2 border border-secondary d-flex align-items-center"
              style={{ minWidth: "260px", minHeight: "90px" }}
            >
              <HabitTracker />
            </div>
          </div>
        </div>

        {collections && (
          <div className="container container--full px-0 px-lg-4 mx-0 mx-lg-auto">
            <div className="collection-container py-4 px-4 px-lg-5 mt-3">
              <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
                <h6 className="text-uppercase m-0">Collections</h6>
                <Link className="text-dark text-underline" to="/collections">
                  See all
                </Link>
              </div>
              <div className="row">
                {collections.slice(0, 4).map(item => (
                  <CollectionItem key={item.id} collection={item} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="container container--full px-4">
          {featuredRow &&
            Object.keys(featuredRow).length > 0 && (
              <div className="my-4 mt-5">
                <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
                  <h6 className="text-uppercase m-0">
                    Featured
                    <i className="fa fa-bullhorn ml-1" />
                  </h6>
                </div>
                {featuredRow.decks.length > 0 && (
                  <div className="row">
                    {featuredRow.decks.slice(0, 4).map(deck => (
                      <DeckItem
                        deck={deck}
                        key={deck.id}
                        isSaved={this.isSaved(deck.id)}
                        deckProgress={this.getDeckProgress(deck.id)}
                        onToggleSave={this.onToggleSave}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          {trendingRow &&
            Object.keys(trendingRow).length > 0 && (
              <div className="my-4">
                <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
                  <h6 className="text-uppercase m-0">
                    {trendingRow.name}
                    <span className="icon-dark ml-1" role="img" aria-label="Sparkles">
                      ✨
                    </span>
                  </h6>
                  <Link className="text-dark text-underline" to={`/collections/${trendingRow.id}`}>
                    See all
                  </Link>
                </div>
                {trendingRow.decks.length > 0 && (
                  <div className="row">
                    {trendingRow.decks.slice(0, 4).map(deck => (
                      <DeckItem
                        deck={deck}
                        key={deck.id}
                        isSaved={this.isSaved(deck.id)}
                        deckProgress={this.getDeckProgress(deck.id)}
                        onToggleSave={this.onToggleSave}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          {newestRow &&
            Object.keys(newestRow).length > 0 && (
              <div className="my-4">
                <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
                  <h6 className="text-uppercase m-0">
                    {newestRow.name}
                    <i className="far fa-clock ml-1" />
                  </h6>
                  <Link className="text-dark text-underline" to={`/collections/${newestRow.id}`}>
                    See all
                  </Link>
                </div>
                {newestRow.decks.length > 0 && (
                  <div className="row">
                    {newestRow.decks.slice(0, 4).map(deck => (
                      <DeckItem
                        deck={deck}
                        key={deck.id}
                        isSaved={this.isSaved(deck.id)}
                        deckProgress={this.getDeckProgress(deck.id)}
                        onToggleSave={this.onToggleSave}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          <div className="row d-flex justify-content-center mt-2 mb-5">
            <a
              className="d-flex align-items-center btn btn-outline-dark px-3"
              href={config.airtableSuggestionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderRadius: "999px" }}
            >
              <i className="fa fa-plus mr-2" />
              <span>Suggest a deck</span>
            </a>
          </div>
          <div className="row">
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
