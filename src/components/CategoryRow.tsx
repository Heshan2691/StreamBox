import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/theme";
import { useAppTheme } from "../hooks/useAppTheme";
import { Media } from "../types/media";
import { MediaCard } from "./MediaCard";

interface CategoryRowProps {
  title: string;
  data: Media[];
  onMediaPress: (media: Media) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (mediaId: string) => void;
  horizontal?: boolean;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  title,
  data,
  onMediaPress,
  favoriteIds = [],
  onToggleFavorite,
  horizontal = true,
}) => {
  const { isDark } = useAppTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <MediaCard
            media={item}
            onPress={() => onMediaPress(item)}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={
              onToggleFavorite ? () => onToggleFavorite(item.id) : undefined
            }
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          horizontal ? styles.horizontalList : styles.gridList
        }
        numColumns={horizontal ? undefined : 2}
        key={horizontal ? "h" : "v"} // Force re-render when orientation changes
        columnWrapperStyle={!horizontal ? styles.columnWrapper : undefined}
        ListFooterComponent={
          !horizontal ? <View style={styles.bottomPadding} /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
    marginLeft: 16,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  gridList: {
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  bottomPadding: {
    height: 32,
  },
});
