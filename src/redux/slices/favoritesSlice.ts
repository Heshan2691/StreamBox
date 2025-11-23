import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  byUser: {
    [userId: string]: string[]; // userId -> array of favorite mediaIds
  };
  currentUserId: string | null;
}

const initialState: FavoritesState = {
  byUser: {},
  currentUserId: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string | null>) => {
      state.currentUserId = action.payload;
      // Ensure byUser object exists
      if (!state.byUser) {
        state.byUser = {};
      }
      // Initialize empty array for new user if doesn't exist
      if (action.payload && !state.byUser[action.payload]) {
        state.byUser[action.payload] = [];
      }
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.currentUserId) return;
      const userFavorites = state.byUser[state.currentUserId] || [];
      if (!userFavorites.includes(action.payload)) {
        state.byUser[state.currentUserId] = [...userFavorites, action.payload];
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      if (!state.currentUserId) return;
      const userFavorites = state.byUser[state.currentUserId] || [];
      state.byUser[state.currentUserId] = userFavorites.filter(id => id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      if (!state.currentUserId) return;
      const userFavorites = state.byUser[state.currentUserId] || [];
      const index = userFavorites.indexOf(action.payload);
      if (index >= 0) {
        state.byUser[state.currentUserId] = userFavorites.filter(id => id !== action.payload);
      } else {
        state.byUser[state.currentUserId] = [...userFavorites, action.payload];
      }
    },
    clearFavorites: (state) => {
      state.currentUserId = null;
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, setCurrentUser, clearFavorites } = favoritesSlice.actions;

// Selector to get current user's favorites
export const selectCurrentUserFavorites = (state: { favorites: FavoritesState }) => {
  if (!state.favorites || !state.favorites.byUser) return [];
  const { currentUserId, byUser } = state.favorites;
  return currentUserId ? (byUser[currentUserId] || []) : [];
};

export default favoritesSlice.reducer;
