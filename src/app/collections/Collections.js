import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

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
    pinnedDecks: [],
    studyProgress: [],
  };

  componentWillMount() {
    this.context.mixpanel.track("Specific Collections Page.");
    const { params } = this.props.match;

    if (this.isPinnedDecksPage()) {
      this.fetchPinnedDecksCollection();
    } else {
      this.fetchPinnedDecks();
      this.fetchCollection(params.collectionId);
    }

    this.fetchStudyProgress();
  }

  onTogglePin = (event, deck) => {
    event.preventDefault();
    const isPinned = this.isPinned(deck.id);

    analytics.logPinDeckAction(deck.name, isPinned);

    this.pinDeck(deck, isPinned);
  };

  sortDecks = (decks = []) => [...decks].sort((a, b) => b.new - a.new);

  fetchCollection = id => {
    api.fetchCollection(id).then(
      ({ data }) => {
        this.setState({ collection: data, decks: this.sortDecks(data.decks), isLoading: false });
      },
      error => console.error(error),
    );
  };

  fetchPinnedDecks = () => {
    if (isAuthenticated()) {
      api.fetchPinnedDecks().then(({ data }) => {
        this.setState({ pinnedDecks: data });
      });
    } else {
      this.setState({ pinnedDecks: localStorage.getPinnedDecks() });
    }
  };

  fetchPinnedDecksCollection = () => {
    if (isAuthenticated()) {
      api.fetchPinnedDecks().then(({ data }) => {
        this.setState({
          pinnedDecks: data,
          collection: {
            name: "My Pinned Decks",
            id: "pinned",
            description: "A collection of my all-time favorite decks to learn.",
          },
          decks: this.sortDecks(data),
          isLoading: false,
        });
      });
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

  pinDeck = (deck, isPinned) => {
    const { decks } = this.state;
    if (isAuthenticated()) {
      api
        .togglePinnedDeck(deck.id, isPinned)
        .then(({ data }) =>
          this.setState({ pinnedDecks: data, decks: this.isPinnedDecksPage() ? data : decks }),
        )
        .catch(this.handleError);
    } else {
      this.setState({ pinnedDecks: localStorage.togglePinnedDeck(deck.id, isPinned) });
    }
  };

  isPinned = id => this.state.pinnedDecks.find(el => el.id === id || el === id);
  isPinnedDecksPage = () => this.props.match.params.collectionId === "pinned";
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
      <div>
        <div
          className="collection-header py-4"
          style={{ background: "#f9f9f9", borderBottom: "1px solid #e8e8e8" }}
        >
          <div className="container container--full px-4 my-2">
            <div className="d-flex flex-column-reverse flex-lg-row justify-content-between align-items-lg-center">
              <div className="m-2">
                <h1 className="m-0">{collection.name}</h1>
                {collection.description && <p className="m-0">{collection.description}</p>}
                {this.isPinnedDecksPage() && (
                  <Link
                    className="btn btn-dark font-weight-medium text-uppercase d-block d-sm-inline-block mt-2"
                    style={{ borderRadius: "999px", fontSize: ".75em", padding: "5px 35px" }}
                    onClick={() => analytics.logUserAction("Clicked 'Study now' button")}
                    to={`/collections/${collection.id}/review`}
                  >
                    Study Now
                  </Link>
                )}
              </div>
              <div
                className="bg-light rounded px-3 py-2 mb-2 border border-secondary d-flex align-items-center"
                style={{ minWidth: "260px", minHeight: "90px" }}
              >
                <SkillProgress decks={decks} studyProgress={studyProgress} />
              </div>
            </div>
          </div>
        </div>

        <div className="container container--full px-4 my-3">
          {decks.length > 0 ? (
            <div className="row pt-4" style={{ minHeight: "40vh" }}>
              {decks.map(deck => (
                <DeckItem
                  deck={deck}
                  deckProgress={this.getDeckProgress(deck.id)}
                  key={deck.id}
                  location={location}
                  isPinned={this.isPinned(deck.id)}
                  onTogglePin={this.onTogglePin}
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

Collections.defaultProps = {
  match: { params: {} },
};
Collections.contextTypes = {
  mixpanel: PropTypes.object.isRequired,
};
export default Collections;
