import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../constants/theme";
import { CategoryRow } from "../components/CategoryRow";
import { useAppTheme } from "../hooks/useAppTheme";
import {
  selectCurrentUserFavorites,
  toggleFavorite,
} from "../redux/slices/favoritesSlice";
import {
  fetchAllMedia,
  fetchDocumentaries,
  fetchMovies,
  fetchSeries,
} from "../redux/slices/mediaSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Media } from "../types/media";

type FilterType = "all" | "movie" | "series" | "documentary";

export default function BrowseScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const { isDark } = useAppTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const { moviesList, seriesList, documentariesList } = useSelector(
    (state: RootState) => state.media
  );
  const favoriteIds = useSelector(selectCurrentUserFavorites);

  useEffect(() => {
    dispatch(fetchAllMedia());
    dispatch(fetchMovies());
    dispatch(fetchSeries());
    dispatch(fetchDocumentaries());
  }, [dispatch]);

  const handleMediaPress = (media: Media) => {
    (navigation as any).navigate("MediaDetail", { mediaId: media.id });
  };

  const handleToggleFavorite = (mediaId: string) => {
    dispatch(toggleFavorite(mediaId));
  };

  const getFilteredData = () => {
    switch (selectedFilter) {
      case "movie":
        return moviesList;
      case "series":
        return seriesList;
      case "documentary":
        return documentariesList;
      default:
        return [...moviesList, ...seriesList, ...documentariesList];
    }
  };

  const filters: { type: FilterType; label: string }[] = [
    { type: "all", label: "All" },
    { type: "movie", label: "Movies" },
    { type: "series", label: "Series" },
    { type: "documentary", label: "Documentaries" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.filterWrapper,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.type}
              style={[
                styles.filterButton,
                { backgroundColor: isDark ? "#2a2a2a" : "#F5F5F5" },
                selectedFilter === filter.type && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => setSelectedFilter(filter.type)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.icon },
                  selectedFilter === filter.type && { color: "#FFF" },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <CategoryRow
          title={
            selectedFilter === "all"
              ? "All Content"
              : filters.find((f) => f.type === selectedFilter)?.label || ""
          }
          data={getFilteredData()}
          onMediaPress={handleMediaPress}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          horizontal={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  filterWrapper: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingVertical: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#FFF",
  },
  content: {
    flex: 1,
  },
});
