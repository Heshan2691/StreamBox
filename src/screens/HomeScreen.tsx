import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CategoryRow } from "../components/CategoryRow";
import { FeaturedBanner } from "../components/FeaturedBanner";
import { toggleFavorite } from "../redux/slices/favoritesSlice";
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
  const { favoriteIds } = useSelector((state: RootState) => state.favorites);

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
      {featuredMedia.length > 0 && (
        <FeaturedBanner
          media={featuredMedia[0]}
          onPress={() => handleMediaPress(featuredMedia[0])}
          onPlayPress={() => handleMediaPress(featuredMedia[0])}
        />
      )}

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

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  bottomPadding: {
    height: 32,
  },
});
