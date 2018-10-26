import React, { Component } from "react";
import cx from "classnames";
import moment from "moment";
import cookie from "js-cookie";

import isAuthenticated from "../utils/isAuthenticated";
import UpgradeModal from "../auth/UpgradeModal";
import isProMember from "../utils/isProMember";

import * as leitner from "../../spaced/leitner";
import * as api from "../apiActions";
import * as localStorage from "../utils/localStorage";
import * as studyProgress from "../utils/studyProgress";
import * as chance from "../utils/chance";
import * as analytics from "../../components/GoogleAnalytics";

import CardsSection from "./CardsSection";
import SettingsSection from "./SettingsSection";
import StudySection from "./StudySection";
import ReviewHeader from "./ReviewHeader";

import "./Review.css";

const SELF_GRADE_CORRECT = "I was right";
const SELF_GRADE_INCORRECT = "I was wrong";
const TABS = {
  STUDY: "study",
  CARDS: "cards",
  SETTINGS: "settings",
};

const Tab = ({ active, className, children, onClick }) => (
  <div
    onClick={onClick}
    className={cx("text-uppercase py-2 px-3", { "border-primary": active })}
    style={{ borderBottom: active ? "2px solid blue" : "none", cursor: "pointer" }}
  >
    <span
      className={cx("small font-weight-medium", {
        "text-primary": active,
        "text-muted": !active,
      })}
    >
      {children}
    </span>
  </div>
);

class Review extends Component {
  state = {
    deck: {},
    cards: [],
    correctness: [],
    activeTab: TABS.STUDY,
    options: [],
    index: 0,
    isWrong: false,
    isDeckLoading: true,
    isCardsLoading: true,
    isError: false,
    isReversed: false,
    isRevealed: false,
    numCorrect: 0,
    numIncorrect: 0,
    selected: {},
    cardProgress: [],
    page: 0,
  };

  // Lifecycle methods
  componentDidMount() {
    const { params } = this.props.match;
    if (this.isCollectionPage()) {
      this.fetchCollection(params.collectionId);
      this.fetchMixedCards(params.collectionId);
      this.fetchStudyProgress();
    } else {
      this.fetchDeck(params.deckId);
      this.fetchDeckProgress(params.deckId);
    }
    if (params.tabName && params.tabName.length > 0) {
      this.setState({ activeTab: params.tabName });
    }
  }

  // Event Listeners
  onUpdateDeck = deck => this.setState({ deck: deck });
  onDeleteDeck = () => this.props.history.push("/");

  onTabSelect = value => {
    const { deckId } = this.props.match.params;
    this.props.history.push(`/decks/${deckId}/${value}`);
    this.setState({ activeTab: value });
  };

  onSRSToggle = value => {
    analytics.logToggleFamiliarCards(value);
    this.setState({ isCardsLoading: true }, () => {
      if (this.isCollectionPage()) {
        const { collectionId } = this.props.match.params;
        this.fetchMixedCards(collectionId);
      } else {
        const { deckId } = this.props.match.params;
        this.fetchCards(deckId);
      }
    });
  };

  // API helper methods
  fetchDeck = deckId => {
    api.fetchDeck(deckId).then(
      ({ data }) => {
        // TODO: Set the name on the server-side
        document.title = data.name
          ? `${data.name} | Flashcards for Developers`
          : "Flashcards for Developers";
        this.setState({ deck: data, isDeckLoading: false }, () => this.fetchCards(data.id));
      },
      error => this.setState({ isError: true, isDeckLoading: false }),
    );
  };

  fetchCollection = collectionId => {
    if (this.isPinnedCollection()) {
      this.setState({
        deck: {
          name: "My Pinned Decks",
          type: "Self graded",
          description: "A collection of my all-time favorite decks that I want to learn.",
        },
        isDeckLoading: false,
      });
    } else {
      api
        .fetchCollection(collectionId)
        .then(({ data }) => {
          this.setState({ deck: { ...data, type: "Self graded" }, isDeckLoading: false });
        })
        .catch(error => this.setState({ isError: true, isCardsLoading: false }));
    }
  };

  fetchCards = deckId => {
    api
      .fetchCards({ deck: deckId })
      .then(this.handleCardsResponse)
      .catch(this.handleError);
  };

  fetchMixedCards = collectionId => {
    // Edge case: fetching a set of mixed cards from a set of pinned decks.
    const params =
      !isAuthenticated() && this.isPinnedCollection()
        ? { deckIds: localStorage.getPinnedDecks() }
        : { collection: collectionId };

    api
      .fetchCards(params)
      .then(this.handleCardsResponse)
      .catch(this.handleError);
  };

  fetchDeckProgress = deckId => {
    if (isAuthenticated()) {
      api
        .fetchDeckStudyProgress(deckId)
        .then(({ data }) => this.setState({ cardProgress: data.cards || [] }))
        .catch(this.handleError);
    } else {
      const deckProgress = localStorage.getDeckProgressObject(deckId) || {};
      this.setState({ cardProgress: deckProgress.cards || [] });
    }
  };

  fetchStudyProgress = () => {
    if (isAuthenticated()) {
      api
        .fetchStudyProgress()
        .then(({ data }) => {
          const cardProgress = data.reduce((acc, el) => [...acc, ...el.cards], []);
          this.setState({ cardProgress });
        })
        .catch(this.handleError);
    } else {
      const studyProgress = localStorage.getStudyProgress();
      const cardProgress = studyProgress.reduce((acc, el) => [...acc, ...el.cards], []);
      this.setState({ cardProgress });
    }
  };

  handleCardsResponse = ({ data }) => {
    const { index } = this.state;
    const isSRS = localStorage.getSRSPref();
    const filteredCards = isSRS ? this.filterExpiredCards(data) : data;
    const cards = chance.shuffle(filteredCards);
    const options = this.getOptions(index, cards);
    this.setState({ cards, options, index: 0, isCardsLoading: false });
  };

  setStudyProgress = (card, isCorrect) => {
    const deckId = card.deck.id || card.deck;
    const cardObj = this.state.cardProgress.find(el => el.card === card.id) || {};
    const { reviewedAt, leitnerBox } = studyProgress.calcUpdatedLevel(cardObj, isCorrect);

    if (isAuthenticated()) {
      api
        .addCardProgress(deckId, card.id, leitnerBox, reviewedAt)
        .then(({ data }) => this.setState({ cardProgress: data.cards }))
        .catch(this.handleError);
    } else {
      const deckProgress = localStorage.addCardProgress(deckId, card.id, leitnerBox, reviewedAt);
      this.setState({ cardProgress: deckProgress.cards });
    }
  };

  setStudySession = () => {
    const currentDate = moment().startOf("day");

    if (isAuthenticated()) {
      api.addStudySession(currentDate).catch(this.handleError);
    } else {
      localStorage.addStudySession(currentDate);
    }
  };

  handleError = error => {
    console.error(error);
    this.setState({ isError: true, isCardsLoading: false, isDeckLoading: false });
  };

  filterExpiredCards = cards => {
    const { cardProgress = [] } = this.state;

    return cards.filter(card => {
      const cardObj = cardProgress.find(el => el.card === card.id);
      return !!cardObj ? leitner.isExpired(cardObj.leitnerBox, cardObj.reviewedAt) : true;
    });
  };

  getOptions = (index, cards) => {
    if (this.isSelfGraded()) {
      return [SELF_GRADE_CORRECT, SELF_GRADE_INCORRECT];
    } else if (this.isMultiple()) {
      return [...new Set(cards.map(el => el.back))].map((el, i) => ({ id: i, back: el }));
    } else {
      const numOptions = Math.min(3, cards.length);
      const shuffledCards = chance.shuffle(cards).slice(0, numOptions);
      const uniqueCards = [...new Set([...shuffledCards, cards[index]])];
      return chance.shuffle(uniqueCards);
    }
  };

  // State helper methods
  isSelfGraded = deck => (deck || this.state.deck).type === "Self graded";
  isMultiple = deck => (deck || this.state.deck).type === "Multiple select";
  isPinnedCollection = () => this.props.match.params.collectionId === "pinned";
  isCollectionPage = () => this.props.match.path === "/collections/:collectionId/review";
  isDeckOwner = () => {
    const { deck } = this.state;
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};
    return isAuthenticated() && deck.author === user.id;
  };

  render() {
    const { deck, options, activeTab, isDeckLoading, isError } = this.state;

    if (isDeckLoading) {
      return (
        <div className="container container--narrow px-0">
          <div className="p-4 text-center w-100">
            <h5 className="text-secondary">
              <i className="fas fa-spinner fa-spin mr-1" />
              Loading deck...
            </h5>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="container container--narrow px-0">
          <div className="text-center p-4">
            <h1 className="text-dark">Unable to load request</h1>
            <p>Please try again or go back home.</p>
          </div>
        </div>
      );
    }

    const showUpgradeModal = Boolean(deck) && deck.pro && !isProMember();

    return (
      <div>
        <UpgradeModal isOpen={showUpgradeModal} title="Unlock this deck with Flashcards Pro" />
        <div
          className="review-header pt-4"
          style={{ background: "#f9f9f9", borderBottom: "1px solid #e8e8e8" }}
        >
          <div className="container container--narrow">
            {Boolean(deck) && <ReviewHeader deck={deck} className="review-header mt-3 mb-2" />}

            <div className="d-flex mt-3">
              <Tab onClick={() => this.onTabSelect(TABS.STUDY)} active={activeTab === TABS.STUDY}>
                Study
              </Tab>
              <Tab onClick={() => this.onTabSelect(TABS.CARDS)} active={activeTab === TABS.CARDS}>
                Cards ({this.state.cards.length})
              </Tab>
              {this.isDeckOwner() && (
                <Tab
                  onClick={() => this.onTabSelect(TABS.SETTINGS)}
                  active={activeTab === TABS.SETTINGS}
                >
                  Settings
                </Tab>
              )}
            </div>
          </div>
        </div>

        {activeTab === TABS.STUDY && (
          <div className="container container--narrow py-4">
            <StudySection
              deck={deck}
              cards={this.state.cards}
              options={options}
              cardProgress={this.state.cardProgress}
              getOptions={this.getOptions}
              onUpdateSession={this.setStudySession}
              onUpdateProgress={this.setStudyProgress}
              onSRSToggle={this.onSRSToggle}
              isLoading={this.state.isCardsLoading}
            />
          </div>
        )}
        {activeTab === TABS.CARDS &&
          !this.state.isCardsLoading && (
            <div className="container container--narrow py-4">
              <CardsSection deck={this.state.deck} cards={this.state.cards} />
            </div>
          )}
        {activeTab === TABS.SETTINGS &&
          this.isDeckOwner() &&
          !this.state.isDeckLoading && (
            <div className="container container--narrow py-4">
              <SettingsSection
                deck={this.state.deck}
                onUpdateDeck={this.onUpdateDeck}
                onDeleteDeck={this.onDeleteDeck}
              />
            </div>
          )}
      </div>
    );
  }
}

Review.defaultProps = {
  match: { params: {} },
};

export default Review;
