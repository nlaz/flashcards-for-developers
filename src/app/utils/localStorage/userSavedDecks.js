const SAVED_DECKS_KEY = "savedDecks";

export const setSavedDecks = decks => {
  localStorage.setItem(SAVED_DECKS_KEY, JSON.stringify(decks));
};

export const getSavedDecks = () => {
  return JSON.parse(localStorage.getItem(SAVED_DECKS_KEY)) || [];
};

export const toggleSavedDeck = (deckId, isSaved) => {
  const decks = getSavedDecks();

  const newDecks = isSaved ? decks.filter(el => el !== deckId) : [...decks, deckId];

  setSavedDecks(newDecks);

  return getSavedDecks();
};
