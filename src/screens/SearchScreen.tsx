import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CategoryRow } from "../components/CategoryRow";
import { SearchBar } from "../components/SearchBar";
import {
  selectCurrentUserFavorites,
  toggleFavorite,
} from "../redux/slices/favoritesSlice";
import {
  clearSearch,
  searchMedia,
  setQuery,
} from "../redux/slices/searchSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Media } from "../types/media";

export default function SearchScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { query, results, loading } = useSelector(
    (state: RootState) => state.search
  );
  const favoriteIds = useSelector(selectCurrentUserFavorites);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      dispatch(searchMedia(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  const handleSearchChange = (text: string) => {
    dispatch(setQuery(text));
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
  };

  const handleMediaPress = (media: Media) => {
    (navigation as any).navigate("MediaDetail", { mediaId: media.id });
  };

  const handleToggleFavorite = (mediaId: string) => {
    dispatch(toggleFavorite(mediaId));
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={handleSearchChange}
        onClear={handleClearSearch}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {!loading && query.trim().length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Search for Content</Text>
          <Text style={styles.emptyText}>
            Find your favorite movies, series, and documentaries
          </Text>
        </View>
      )}

      {!loading && query.trim().length > 0 && results.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyText}>
            Try searching with different keywords
          </Text>
        </View>
      )}

      {!loading && results.length > 0 && (
        <CategoryRow
          title={`Results (${results.length})`}
          data={results}
          onMediaPress={handleMediaPress}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          horizontal={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    paddingTop: 100,
    alignItems: "center",
  },
  emptyContainer: {
    paddingTop: 100,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
