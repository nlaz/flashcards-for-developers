const SAVED_DECKS_KEY = "savedDecks";

export const setSavedDecks = decks => {
  localStorage.setItem(SAVED_DECKS_KEY, JSON.stringify(decks));
};

export const getSavedDecks = () => {
  return JSON.parse(localStorage.getItem(SAVED_DECKS_KEY)) || [];
};
