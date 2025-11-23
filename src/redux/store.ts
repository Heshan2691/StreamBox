import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { persistReducer, persistStore } from 'redux-persist';
import favoritesReducer from './slices/favoritesSlice';
import mediaReducer from './slices/mediaSlice';
import searchReducer from './slices/searchSlice';
import userReducer from './slices/userSlice';
import watchlistReducer from './slices/watchlistSlice';

// Use localStorage for web, AsyncStorage for native
const storage = Platform.OS === 'web' 
  ? require('redux-persist/lib/storage').default 
  : AsyncStorage;

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['favorites', 'watchlist', 'user'], // Only persist these reducers
};

const rootReducer = combineReducers({
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

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
