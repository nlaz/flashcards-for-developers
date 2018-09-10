const SAVED_DECKS_KEY = "savedDecks";

export const toggleSavedDeck = (deckId, isSaved) => {
  const decks = this.getSavedDecks();

  const newDecks = isSaved ? decks.filter(el => el !== deckId) : [...decks, deckId];

  this.setSavedDecks(newDecks);

  return this.getSavedDecks();
};

export const setSavedDecks = decks => {
  localStorage.setItem(SAVED_DECKS_KEY, JSON.stringify(decks));
};

export const getSavedDecks = () => {
  return JSON.parse(localStorage.getItem(SAVED_DECKS_KEY)) || [];
};
