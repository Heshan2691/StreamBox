import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WatchlistItem } from '../../types/media';

interface WatchlistState {
  items: WatchlistItem[];
}

const initialState: WatchlistState = {
  items: [],
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<string>) => {
      const exists = state.items.find(item => item.mediaId === action.payload);
      if (!exists) {
        state.items.push({
          mediaId: action.payload,
          addedDate: new Date().toISOString(),
        });
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.mediaId !== action.payload);
    },
    toggleWatchlist: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.mediaId === action.payload);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          mediaId: action.payload,
          addedDate: new Date().toISOString(),
        });
      }
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, toggleWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
