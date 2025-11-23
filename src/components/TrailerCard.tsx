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
import { Media } from "../types/media";

interface TrailerCardProps {
  media: Media;
  onPress: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 64; // Full width with padding

export const TrailerCard: React.FC<TrailerCardProps> = ({ media, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: media.backdropUrl || media.posterUrl }}
          style={styles.backdrop}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={32} color="#FFF" />
          </View>
        </View>
        <View style={styles.durationBadge}>
          <Ionicons name="videocam" size={14} color="#FFF" />
          <Text style={styles.durationText}>Trailer</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {media.title}
        </Text>
        <View style={styles.metadata}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{media.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.year}>{media.releaseYear}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.type}>
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
    marginRight: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 122, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  durationBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    marginLeft: 4,
  },
  separator: {
    fontSize: 13,
    color: "#8E8E93",
    marginHorizontal: 8,
  },
  year: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  type: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "600",
  },
});
