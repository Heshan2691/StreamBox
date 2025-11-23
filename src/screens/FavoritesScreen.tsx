import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { CategoryRow } from "../components/CategoryRow";
import { RootState } from "../redux/store";
import { Media } from "../types/media";

export default function FavoritesScreen() {
  const navigation = useNavigation();

  const { allMedia } = useSelector((state: RootState) => state.media);
  const { favoriteIds } = useSelector((state: RootState) => state.favorites);
  const { items: watchlistItems } = useSelector(
    (state: RootState) => state.watchlist
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {favoriteMedia.length === 0 && watchlistMedia.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>
            Start adding your favorite content to see them here
          </Text>
        </View>
      )}

      {favoriteMedia.length > 0 && (
        <CategoryRow
          title="My Favorites"
          data={favoriteMedia}
          onMediaPress={handleMediaPress}
          favoriteIds={favoriteIds}
          horizontal={false}
        />
      )}

      {watchlistMedia.length > 0 && (
        <CategoryRow
          title="My Watchlist"
          data={watchlistMedia}
          onMediaPress={handleMediaPress}
          favoriteIds={favoriteIds}
          horizontal={false}
        />
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
  bottomPadding: {
    height: 32,
  },
});
