import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

interface FeaturedBannerProps {
  media: Media;
  onPress: () => void;
  onPlayPress?: () => void;
}

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.6;

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({
  media,
  onPress,
  onPlayPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: media.backdropUrl }}
        style={styles.backdrop}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {media.title}
          </Text>
          <View style={styles.metadata}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
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
                : "Doc"}
            </Text>
          </View>
          <Text style={styles.description} numberOfLines={3}>
            {media.description}
          </Text>
          {onPlayPress && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={(e) => {
                e.stopPropagation();
                onPlayPress();
              }}
            >
              <Ionicons name="play" size={20} color="#FFF" />
              <Text style={styles.playText}>Play Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: BANNER_HEIGHT,
    marginBottom: 16,
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
    justifyContent: "flex-end",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  rating: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  separator: {
    color: "#CCC",
    marginHorizontal: 8,
  },
  year: {
    color: "#CCC",
    fontSize: 14,
  },
  type: {
    color: "#CCC",
    fontSize: 14,
    textTransform: "capitalize",
  },
  description: {
    color: "#E0E0E0",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: "flex-start",
  },
  playText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
