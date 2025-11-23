import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WatchlistItem } from '../../types/media';

interface WatchlistState {
  byUser: {
    [userId: string]: WatchlistItem[]; // userId -> array of watchlist items
  };
  currentUserId: string | null;
}

const initialState: WatchlistState = {
  byUser: {},
  currentUserId: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
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
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.currentUserId) return;
      const userWatchlist = state.byUser[state.currentUserId] || [];
      const exists = userWatchlist.find(item => item.mediaId === action.payload);
      if (!exists) {
        state.byUser[state.currentUserId] = [
          ...userWatchlist,
          {
            mediaId: action.payload,
            addedDate: new Date().toISOString(),
          },
        ];
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.currentUserId) return;
      const userWatchlist = state.byUser[state.currentUserId] || [];
      state.byUser[state.currentUserId] = userWatchlist.filter(item => item.mediaId !== action.payload);
    },
    toggleWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.currentUserId) return;
      const userWatchlist = state.byUser[state.currentUserId] || [];
      const index = userWatchlist.findIndex(item => item.mediaId === action.payload);
      if (index >= 0) {
        state.byUser[state.currentUserId] = userWatchlist.filter(item => item.mediaId !== action.payload);
      } else {
        state.byUser[state.currentUserId] = [
          ...userWatchlist,
          {
            mediaId: action.payload,
            addedDate: new Date().toISOString(),
          },
        ];
      }
    },
    clearWatchlist: (state) => {
      state.currentUserId = null;
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, toggleWatchlist, setCurrentUser, clearWatchlist } = watchlistSlice.actions;

// Selector to get current user's watchlist
export const selectCurrentUserWatchlist = (state: { watchlist: WatchlistState }) => {
  if (!state.watchlist || !state.watchlist.byUser) return [];
  const { currentUserId, byUser } = state.watchlist;
  return currentUserId ? (byUser[currentUserId] || []) : [];
};

export default watchlistSlice.reducer;
