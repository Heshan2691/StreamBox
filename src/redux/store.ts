import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './slices/authSlice';
import favoritesReducer, { clearFavorites, setCurrentUser as setFavoritesUser } from './slices/favoritesSlice';
import mediaReducer from './slices/mediaSlice';
import searchReducer from './slices/searchSlice';
import userReducer from './slices/userSlice';
import watchlistReducer, { clearWatchlist, setCurrentUser as setWatchlistUser } from './slices/watchlistSlice';

// Use localStorage for web, AsyncStorage for native
const storage = Platform.OS === 'web' 
  ? require('redux-persist/lib/storage').default 
  : AsyncStorage;

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['favorites', 'watchlist', 'user'], // Only persist these reducers - auth uses SecureStore
};

const rootReducer = combineReducers({
  auth: authReducer,
  media: mediaReducer,
  favorites: favoritesReducer,
  watchlist: watchlistReducer,
  search: searchReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Middleware to sync user changes with favorites and watchlist
store.subscribe(() => {
  const state = store.getState();
  
  // Check if state is properly initialized
  if (!state.auth || !state.favorites || !state.watchlist) {
    return;
  }
  
  const userId = state.auth.user?.id.toString() || null;
  const currentFavoritesUserId = state.favorites.currentUserId;
  const currentWatchlistUserId = state.watchlist.currentUserId;

  // When auth state changes, update favorites and watchlist current user
  if (userId !== currentFavoritesUserId) {
    store.dispatch(setFavoritesUser(userId));
  }
  if (userId !== currentWatchlistUserId) {
    store.dispatch(setWatchlistUser(userId));
  }

  // Clear when logged out
  if (!userId && (currentFavoritesUserId || currentWatchlistUserId)) {
    store.dispatch(clearFavorites());
    store.dispatch(clearWatchlist());
  }
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
