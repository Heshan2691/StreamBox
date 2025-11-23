import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../../constants/theme";
import { MediaCard } from "../components/MediaCard";
import { useAppTheme } from "../hooks/useAppTheme";
import { selectCurrentUserFavorites } from "../redux/slices/favoritesSlice";
import { selectCurrentUserWatchlist } from "../redux/slices/watchlistSlice";
import { RootState } from "../redux/store";
import { Media } from "../types/media";

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [, setRefreshKey] = useState(0);
  const { isDark } = useAppTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const { allMedia } = useSelector((state: RootState) => state.media);
  const favoriteIds = useSelector(selectCurrentUserFavorites);
  const watchlistItems = useSelector(selectCurrentUserWatchlist);

  // Force refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const favoriteMedia = allMedia.filter((media) =>
    favoriteIds.includes(media.id)
  );
  const watchlistMedia = allMedia.filter((media) =>
    watchlistItems.some((item) => item.mediaId === media.id)
  );

  const handleMediaPress = (media: Media) => {
    (navigation as any).navigate("MediaDetail", { mediaId: media.id });
  };

  const renderMediaGrid = (mediaList: Media[], title: string) => {
    if (mediaList.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: colors.text }]}>
          {title}
        </Text>
        <View style={styles.grid}>
          {mediaList.map((media) => (
            <View key={media.id} style={styles.cardWrapper}>
              <MediaCard
                media={media}
                onPress={() => handleMediaPress(media)}
                isFavorite={favoriteIds.includes(media.id)}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (favoriteMedia.length === 0 && watchlistMedia.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Favorites Yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.icon }]}>
            Start adding your favorite content to see them here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={[1]} // Dummy data to enable scrolling
        renderItem={() => (
          <View>
            {renderMediaGrid(favoriteMedia, "My Favorites")}
            {renderMediaGrid(watchlistMedia, "My Watchlist")}
          </View>
        )}
        keyExtractor={() => "favorites-list"}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
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
