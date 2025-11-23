// Re-export all screens
export { default as BrowseScreen } from './screens/BrowseScreen';
export { default as FavoritesScreen } from './screens/FavoritesScreen';
export { default as HomeScreen } from './screens/HomeScreen';
export { default as MediaDetailScreen } from './screens/MediaDetailScreen';
export { default as ProfileScreen } from './screens/ProfileScreen';
export { default as SearchScreen } from './screens/SearchScreen';

// Re-export navigation
export { default as RootNavigator } from './navigation/RootNavigator';

// Re-export Redux store
export { persistor, store } from './redux/store';
export type { AppDispatch, RootState } from './redux/store';

