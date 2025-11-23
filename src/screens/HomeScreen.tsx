import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CategoryRow } from "../components/CategoryRow";
import { FeaturedBanner } from "../components/FeaturedBanner";
import {
  selectCurrentUserFavorites,
  toggleFavorite,
} from "../redux/slices/favoritesSlice";
import {
  fetchAllMedia,
  fetchFeaturedMedia,
  fetchMovies,
  fetchSeries,
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
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user?.firstName || "Guest"}</Text>
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
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    gap: 4,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  featuredSection: {
    backgroundColor: "#FFF",
    marginTop: 8,
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
