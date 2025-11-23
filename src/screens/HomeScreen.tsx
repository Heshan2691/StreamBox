import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CategoryRow } from "../components/CategoryRow";
import { FeaturedBanner } from "../components/FeaturedBanner";
import { TrailerCard } from "../components/TrailerCard";
import {
  selectCurrentUserFavorites,
  toggleFavorite,
} from "../redux/slices/favoritesSlice";
import {
  fetchAllMedia,
  fetchFeaturedMedia,
  fetchMovies,
  fetchSeries,
  fetchTrailersForMedia,
  fetchTrendingMedia,
} from "../redux/slices/mediaSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Media } from "../types/media";

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);

  const { featuredMedia, trendingMedia, moviesList, seriesList, loading } =
    useSelector((state: RootState) => state.media);
  const favoriteIds = useSelector(selectCurrentUserFavorites);
  const { user } = useSelector((state: RootState) => state.auth);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const loadData = useCallback(async () => {
    await Promise.all([
      dispatch(fetchAllMedia()),
      dispatch(fetchFeaturedMedia()),
      dispatch(fetchTrendingMedia()),
      dispatch(fetchMovies()),
      dispatch(fetchSeries()),
    ]);
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fetch trailers for trending media after they're loaded
  useEffect(() => {
    if (trendingMedia.length > 0 && !trendingMedia[0].trailerUrl) {
      dispatch(fetchTrailersForMedia(trendingMedia.slice(0, 5)));
    }
  }, [trendingMedia, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleMediaPress = (media: Media) => {
    (navigation as any).navigate("MediaDetail", { mediaId: media.id });
  };

  const handleToggleFavorite = (mediaId: string) => {
    dispatch(toggleFavorite(mediaId));
  };

  if (loading && !featuredMedia.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.firstName || "Guest"}</Text>
          </View>
          <View style={styles.userIconContainer}>
            <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
          </View>
        </View>
      </View>

      {featuredMedia.length > 0 && (
        <View style={styles.featuredSection}>
          <FeaturedBanner
            media={featuredMedia[0]}
            onPress={() => handleMediaPress(featuredMedia[0])}
            onPlayPress={() => handleMediaPress(featuredMedia[0])}
          />
        </View>
      )}

      <View style={styles.content}>
        <CategoryRow
          title="Trending Now"
          data={trendingMedia}
          onMediaPress={handleMediaPress}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>

      {/* Latest Trailers Section */}
      {trendingMedia.length > 0 && (
        <View style={styles.trailersSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="videocam" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>Latest Trailers</Text>
          </View>
          <FlatList
            data={trendingMedia.slice(0, 5)}
            renderItem={({ item }) => (
              <TrailerCard
                media={item}
                onPress={() =>
                  (navigation as any).navigate("VideoPlayer", { media: item })
                }
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trailersList}
          />
        </View>
      )}

      <View style={styles.content}>
        <CategoryRow
          title="Popular Movies"
          data={moviesList.slice(0, 10)}
          onMediaPress={handleMediaPress}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />

        <CategoryRow
          title="Top Series"
          data={seriesList.slice(0, 10)}
          onMediaPress={handleMediaPress}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFF",
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeSection: {
    gap: 6,
    flex: 1,
  },
  greeting: {
    fontSize: 15,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.3,
  },
  userName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  userIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredSection: {
    backgroundColor: "#FFF",
    marginTop: 8,
  },
  trailersSection: {
    backgroundColor: "#FFF",
    marginTop: 8,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 8,
  },
  trailersList: {
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: "#FFF",
    marginTop: 8,
    paddingTop: 8,
  },
  bottomPadding: {
    height: 24,
  },
});
