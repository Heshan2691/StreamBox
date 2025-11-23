import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const { width, height } = Dimensions.get("window");

export default function VideoPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { media } = route.params as any;

  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [youtubeReady, setYoutubeReady] = useState(false);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);

      // Auto-play if not already playing
      if (!status.isPlaying && videoRef.current) {
        videoRef.current.playAsync();
      }
    } else if (status.error) {
      setError("Failed to load video");
      setIsLoading(false);
    }
  };

  // Demo video URLs - different videos for variety
  const demoVideos = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  ];

  // Use media ID to select a consistent but different video for each item
  const getVideoUrl = () => {
    if (media?.trailerUrl) {
      return media.trailerUrl;
    }
    // Use media ID to consistently select same video for same media
    const mediaIdNum = parseInt(media?.id || "0", 10);
    const videoIndex = mediaIdNum % demoVideos.length;
    return demoVideos[videoIndex];
  };

  const videoUrl = getVideoUrl();

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeVideoId = videoUrl ? getYoutubeVideoId(videoUrl) : null;
  const isYoutubeVideo = !!youtubeVideoId;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {media?.title || "Trailer"}
          </Text>
          <Text style={styles.headerSubtitle}>Trailer</Text>
        </View>
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setIsLoading(true);
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : isYoutubeVideo && youtubeVideoId ? (
          <View style={styles.youtubeContainer}>
            <YoutubePlayer
              height={width * (9 / 16)}
              play={true}
              videoId={youtubeVideoId}
              onChangeState={(state: string) => {
                if (state === "ended" || state === "paused") {
                  setIsPlaying(false);
                } else if (state === "playing") {
                  setIsPlaying(true);
                  setIsLoading(false);
                }
              }}
              onReady={() => {
                setIsLoading(false);
                setYoutubeReady(true);
              }}
              onError={() => setError("Failed to load YouTube video")}
              initialPlayerParams={{
                preventFullScreen: false,
                cc_lang_pref: "en",
                showClosedCaptions: false,
              }}
            />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>Loading trailer...</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              useNativeControls={false}
            />

            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFF" />
              </View>
            )}

            {/* Video Controls */}
            {!isLoading && (
              <View style={styles.controlsContainer}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={handlePlayPause}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={40}
                    color="#FFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.muteButton}
                  onPress={handleMuteToggle}
                >
                  <Ionicons
                    name={isMuted ? "volume-mute" : "volume-high"}
                    size={24}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      {/* Media Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{media?.title}</Text>
        <View style={styles.metadata}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{media?.rating?.toFixed(1)}</Text>
          </View>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.year}>{media?.releaseYear}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.type}>
            {media?.type === "movie"
              ? "Movie"
              : media?.type === "series"
              ? "Series"
              : "Documentary"}
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={4}>
          {media?.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  videoContainer: {
    width: width,
    height: width * (9 / 16), // 16:9 aspect ratio
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 12,
  },
  youtubeContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 122, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  muteButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    marginTop: 16,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  infoContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1C1C1E",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 12,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 4,
  },
  separator: {
    fontSize: 14,
    color: "#8E8E93",
    marginHorizontal: 8,
  },
  year: {
    fontSize: 14,
    color: "#8E8E93",
  },
  type: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  description: {
    fontSize: 15,
    color: "#E5E5EA",
    lineHeight: 22,
  },
});
