import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useAppTheme } from "../hooks/useAppTheme";
import { Media } from "../types/media";

interface MediaCardProps {
  media: Media;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 cards per row with padding

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { isDark } = useAppTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: media.posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF4458" : "#FFF"}
            />
          </TouchableOpacity>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{media.rating.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {media.title}
        </Text>
        <Text style={[styles.year, { color: colors.icon }]}>
          {media.releaseYear}
        </Text>
        <View style={styles.typeContainer}>
          <Text style={[styles.typeText, { color: colors.primary }]}>
            {media.type === "movie"
              ? "Movie"
              : media.type === "series"
              ? "Series"
              : "Documentary"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    height: CARD_WIDTH * 1.5,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  info: {
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  typeContainer: {
    alignSelf: "flex-start",
  },
  typeText: {
    fontSize: 10,
    color: "#007AFF",
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
