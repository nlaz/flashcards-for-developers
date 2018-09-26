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
import LoginModal from "../auth/LoginModal";

class Decks extends Component {
  state = {
    newestRow: {},
    trendingRow: {},
    featuredRow: {},
    pinnedDecks: [],
    studyProgress: [],
    collections: [],
    showModal: false,
    isLoading: false,
    isError: false,
  };

  componentWillMount() {
    document.title = "Flashcards for Developers";

    this.fetchPinnedDecks();

    this.fetchFeaturedCollection();
    this.fetchTrendingCollection();
    this.fetchNewestCollection();

    this.fetchStudyProgress();
    this.fetchCollections();
  }

  onTogglePin = (event, deck) => {
    event.preventDefault();
    if (!isAuthenticated()) {
      this.setState({ showModal: true });
    } else {
      const isPinned = this.isPinned(deck.id);
      analytics.logPinDeckAction(deck.name, isPinned);

      api
        .togglePinnedDeck(deck.id, isPinned)
        .then(response => this.setState({ pinnedDecks: response.data }))
        .catch(this.handleError);
    }
  };

  onCloseModal = () => {
    analytics.logLoginAction("User exited login modal");
    this.setState({ showModal: false });
  };

  sortDecks = (decks = []) => [...decks].sort((a, b) => b.new - a.new);

  fetchDecks = collection => {
    api.fetchDecks(collection.id).then(
      ({ data }) => {
        this.setState({ decks: this.sortDecks(data), isLoading: false });
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
  };

  fetchPinnedDecks = () => {
    if (isAuthenticated()) {
      api.fetchPinnedDecks().then(({ data }) => {
        this.setState({ pinnedDecks: data });
      });
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
    api.searchCollections("Featured").then(response => {
      this.setState({ featuredRow: response.data.pop() });
    });
  };

  fetchTrendingCollection = () => {
    api
      .searchCollections("Trending")
      .then(response => this.setState({ trendingRow: response.data.pop() }));
  };

  fetchNewestCollection = () => {
    api
      .searchCollections("Recently Added")
      .then(({ data }) => this.setState({ newestRow: data.pop() }));
  };

  fetchCollections = () => {
    api
      .fetchCollections()
      .then(({ data }) => {
        this.setState({ collections: data });
      })
      .catch(this.handleError);
  };

  handleError = error => console.error(error);

  isPinned = id => this.state.pinnedDecks.find(el => el.id === id);
  getDeckProgress = id => this.state.studyProgress.find(el => el.deck === id);

  render() {
    const {
      featuredRow,
      trendingRow,
      newestRow,
      collections,
      pinnedDecks,
      isLoading,
      isError,
    } = this.state;

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
        <LoginModal isOpen={this.state.showModal} onClose={this.onCloseModal} />
        <div
          className="review-header py-4"
          style={{ background: "#f9f9f9", borderBottom: "1px solid #e8e8e8" }}
        >
          <div className="container container--full px-4 my-2">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
              <div className="home-header py-2">
                <h1 className="m-0">Flashcards for Developers</h1>
                <p className="m-0">
                  A curated list of flashcards to boost your professional skills
                </p>
              </div>
              <div
                className="bg-light rounded p-2 border border-secondary d-flex align-items-center"
                style={{ minWidth: "260px", minHeight: "90px" }}
              >
                <HabitTracker />
              </div>
            </div>
          </div>

          {isAuthenticated() &&
            pinnedDecks &&
            pinnedDecks.length > 0 && (
              <div className="container container--full px-4 mt-4">
                <div className="pinned-row">
                  <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
                    <h6 className="text-uppercase m-0">MY PINNED DECKS</h6>
                    <Link className="text-dark text-underline" to="/collections/pinned">
                      See all
                    </Link>
                  </div>
                  <div className="row">
                    {pinnedDecks.slice(0, 4).map(item => (
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
              </div>
            )}
        </div>

        {collections && (
          <div className="container container--full px-0 px-lg-4 mx-0 mx-lg-auto">
            <div className="mt-5">
              <div className="d-flex justify-content-between align-items-end mb-2 mx-1">
                <h6 className="text-uppercase m-0">Popular Collections</h6>
                <Link className="text-dark text-underline" to="/collections">
                  See all
                </Link>
              </div>
              <div className="row px-4 pt-3">
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
                    Featured Decks
                    <i className="fa fa-bullhorn ml-1" />
                  </h6>
                </div>
                {featuredRow.decks.length > 0 && (
                  <div className="row">
                    {featuredRow.decks.slice(0, 4).map(deck => (
                      <DeckItem
                        deck={deck}
                        key={deck.id}
                        isPinned={this.isPinned(deck.id)}
                        deckProgress={this.getDeckProgress(deck.id)}
                        onTogglePin={this.onTogglePin}
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
                    <i className="fa fa-fire ml-1" />
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
                        isPinned={this.isPinned(deck.id)}
                        deckProgress={this.getDeckProgress(deck.id)}
                        onTogglePin={this.onTogglePin}
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
                        isPinned={this.isPinned(deck.id)}
                        deckProgress={this.getDeckProgress(deck.id)}
                        onTogglePin={this.onTogglePin}
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
