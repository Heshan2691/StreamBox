import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { MediaCard } from "../components/MediaCard";
import { RootState } from "../redux/store";
import { Media } from "../types/media";

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [, setRefreshKey] = useState(0);

  const { allMedia } = useSelector((state: RootState) => state.media);
  const { favoriteIds } = useSelector((state: RootState) => state.favorites);
  const { items: watchlistItems } = useSelector(
    (state: RootState) => state.watchlist
  );

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

  // Combine data with section headers
  const sections = [];
  if (favoriteMedia.length > 0) {
    sections.push({ type: "header", title: "My Favorites" });
    sections.push(...favoriteMedia.map((media) => ({ type: "item", media })));
  }
  if (watchlistMedia.length > 0) {
    sections.push({ type: "header", title: "My Watchlist" });
    sections.push(...watchlistMedia.map((media) => ({ type: "item", media })));
  }

  const renderItem = ({ item }: any) => {
    if (item.type === "header") {
      return <Text style={styles.sectionHeader}>{item.title}</Text>;
    }
    return (
      <View style={styles.cardWrapper}>
        <MediaCard
          media={item.media}
          onPress={() => handleMediaPress(item.media)}
          isFavorite={favoriteIds.includes(item.media.id)}
        />
      </View>
    );
  };

  if (favoriteMedia.length === 0 && watchlistMedia.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>
            Start adding your favorite content to see them here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item: any, index) =>
          item.type === "header" ? `header-${index}` : `item-${item.media.id}`
        }
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
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
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
  },
  cardWrapper: {
    width: "48%",
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
