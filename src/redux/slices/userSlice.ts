import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences } from '../../types/media';

interface UserState {
  preferences: UserPreferences;
  userName: string;
}

const initialState: UserState = {
  preferences: {
    favoriteGenres: [],
    watchHistory: [],
  },
  userName: 'Guest User',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    addFavoriteGenre: (state, action: PayloadAction<string>) => {
      if (!state.preferences.favoriteGenres.includes(action.payload)) {
        state.preferences.favoriteGenres.push(action.payload);
      }
    },
    removeFavoriteGenre: (state, action: PayloadAction<string>) => {
      state.preferences.favoriteGenres = state.preferences.favoriteGenres.filter(
        genre => genre !== action.payload
      );
    },
    addToWatchHistory: (state, action: PayloadAction<string>) => {
      // Add to beginning of array (most recent first)
      state.preferences.watchHistory = [
        action.payload,
        ...state.preferences.watchHistory.filter(id => id !== action.payload),
      ].slice(0, 50); // Keep only last 50 items
    },
  },
});

export const { setUserName, addFavoriteGenre, removeFavoriteGenre, addToWatchHistory } =
  userSlice.actions;
export default userSlice.reducer;
