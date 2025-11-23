import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import mediaService from "../api/mediaService";
import { toggleFavorite } from "../redux/slices/favoritesSlice";
import { addToWatchHistory } from "../redux/slices/userSlice";
import { toggleWatchlist } from "../redux/slices/watchlistSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Media, Review } from "../types/media";

const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(10, "Rating cannot exceed 10")
    .required("Rating is required"),
  comment: Yup.string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review cannot exceed 500 characters")
    .required("Review is required"),
});

export default function MediaDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { mediaId } = route.params as { mediaId: string };

  const [media, setMedia] = useState<Media | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { favoriteIds } = useSelector((state: RootState) => state.favorites);
  const { items: watchlistItems } = useSelector(
    (state: RootState) => state.watchlist
  );
  const { userName } = useSelector((state: RootState) => state.user);

  const isFavorite = favoriteIds.includes(mediaId);
  const isInWatchlist = watchlistItems.some((item) => item.mediaId === mediaId);

  const loadMediaDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [mediaData, reviewsData] = await Promise.all([
        mediaService.getMediaById(mediaId),
        mediaService.getReviewsForMedia(mediaId),
      ]);
      setMedia(mediaData);
      setReviews(reviewsData);

      // Fetch similar media after getting media details
      if (mediaData) {
        const similarMedia = await mediaService.getSimilarMedia(
          mediaId,
          mediaData.type === "documentary" ? "movie" : mediaData.type
        );
        setRecommendations(similarMedia);
      }
    } catch {
      Alert.alert("Error", "Failed to load media details");
    } finally {
      setLoading(false);
    }
  }, [mediaId]);

  useEffect(() => {
    loadMediaDetails();
    dispatch(addToWatchHistory(mediaId));
  }, [mediaId, loadMediaDetails, dispatch]);

  const handleSubmitReview = async (
    values: { rating: number; comment: string },
    { resetForm }: any
  ) => {
    try {
      const newReview = await mediaService.addReview({
        mediaId,
        userId: "user1",
        userName,
        rating: values.rating,
        comment: values.comment,
      });
      setReviews([newReview, ...reviews]);
      setShowReviewForm(false);
      resetForm();
      Alert.alert("Success", "Your review has been submitted!");
    } catch {
      Alert.alert("Error", "Failed to submit review");
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(mediaId));
  };

  const handleToggleWatchlist = () => {
    dispatch(toggleWatchlist(mediaId));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!media) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Media not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Backdrop Image */}
      <View style={styles.backdropContainer}>
        <Image source={{ uri: media.backdropUrl }} style={styles.backdrop} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Poster and Title */}
        <View style={styles.header}>
          <Image source={{ uri: media.posterUrl }} style={styles.poster} />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{media.title}</Text>
            <View style={styles.metadata}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{media.rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.year}>{media.releaseYear}</Text>
            </View>
            <Text style={styles.type}>
              {media.type === "movie"
                ? "Movie"
                : media.type === "series"
                ? "Series"
                : "Documentary"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isFavorite && styles.actionButtonActive,
            ]}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF4458" : "#1A1A1A"}
            />
            <Text
              style={[styles.actionText, isFavorite && styles.actionTextActive]}
            >
              Favorite
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isInWatchlist && styles.actionButtonActive,
            ]}
            onPress={handleToggleWatchlist}
          >
            <Ionicons
              name={isInWatchlist ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isInWatchlist ? "#007AFF" : "#1A1A1A"}
            />
            <Text
              style={[
                styles.actionText,
                isInWatchlist && styles.actionTextActive,
              ]}
            >
              Watchlist
            </Text>
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.description}>{media.description}</Text>
        </View>

        {/* Info Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.infoGrid}>
            {media.duration && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{media.duration} min</Text>
              </View>
            )}
            {media.seasons && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Seasons</Text>
                <Text style={styles.infoValue}>{media.seasons}</Text>
              </View>
            )}
            {media.episodes && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Episodes</Text>
                <Text style={styles.infoValue}>{media.episodes}</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Genre</Text>
              <Text style={styles.infoValue}>{media.genre.join(", ")}</Text>
            </View>
            {media.director && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Director</Text>
                <Text style={styles.infoValue}>{media.director}</Text>
              </View>
            )}
          </View>

          {/* Cast Section */}
          {media.cast && media.cast.length > 0 && (
            <View style={styles.castSection}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.castScroll}
              >
                {media.cast.map((member: any, index: number) => {
                  const isCastMember = typeof member === "object";
                  return (
                    <View key={index} style={styles.castCard}>
                      {isCastMember && member.profileUrl && (
                        <Image
                          source={{ uri: member.profileUrl }}
                          style={styles.castImage}
                          resizeMode="cover"
                        />
                      )}
                      <Text style={styles.castName} numberOfLines={2}>
                        {isCastMember ? member.name : member}
                      </Text>
                      {isCastMember && member.character && (
                        <Text style={styles.castCharacter} numberOfLines={2}>
                          {member.character}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => setShowReviewForm(!showReviewForm)}
            >
              <Text style={styles.addReviewText}>
                {showReviewForm ? "Cancel" : "+ Add Review"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Review Form */}
          {showReviewForm && (
            <Formik
              initialValues={{ rating: 5, comment: "" }}
              validationSchema={ReviewSchema}
              onSubmit={handleSubmitReview}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <View style={styles.reviewForm}>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Rating (1-10)</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.rating && errors.rating && styles.inputError,
                      ]}
                      onChangeText={(text) =>
                        setFieldValue("rating", parseInt(text) || 0)
                      }
                      onBlur={handleBlur("rating")}
                      value={values.rating.toString()}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    {touched.rating && errors.rating && (
                      <Text style={styles.errorText}>{errors.rating}</Text>
                    )}
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Your Review</Text>
                    <TextInput
                      style={[
                        styles.textArea,
                        touched.comment && errors.comment && styles.inputError,
                      ]}
                      onChangeText={handleChange("comment")}
                      onBlur={handleBlur("comment")}
                      value={values.comment}
                      multiline
                      numberOfLines={4}
                      placeholder="Share your thoughts about this content..."
                      placeholderTextColor="#999"
                    />
                    {touched.comment && errors.comment && (
                      <Text style={styles.errorText}>{errors.comment}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.submitButtonText}>Submit Review</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          )}

          {/* Reviews List */}
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.userName}</Text>
                <View style={styles.reviewRating}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.reviewRatingText}>{review.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>You May Also Like</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendationsScroll}
            >
              {recommendations.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recommendationCard}
                  onPress={() => {
                    (navigation as any).navigate("MediaDetail", {
                      mediaId: item.id,
                    });
                  }}
                >
                  <Image
                    source={{ uri: item.posterUrl }}
                    style={styles.recommendationImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.recommendationTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.recommendationRating}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.recommendationRatingText}>
                      {item.rating.toFixed(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  backdropContainer: {
    height: 250,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    marginTop: -60,
    marginBottom: 20,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginLeft: 4,
  },
  year: {
    fontSize: 16,
    color: "#666",
  },
  type: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    gap: 8,
  },
  actionButtonActive: {
    backgroundColor: "#E8F4FF",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  actionTextActive: {
    color: "#007AFF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addReviewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  addReviewText: {
    color: "#FFF",
    fontWeight: "600",
  },
  reviewForm: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1A1A1A",
  },
  textArea: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1A1A1A",
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#FF4458",
  },
  errorText: {
    color: "#FF4458",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewCard: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  castSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  castScroll: {
    marginTop: 12,
  },
  castCard: {
    width: 120,
    marginRight: 12,
    alignItems: "center",
  },
  castImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    marginBottom: 8,
  },
  castName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 4,
  },
  castCharacter: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  recommendationsScroll: {
    marginTop: 12,
  },
  recommendationCard: {
    width: 140,
    marginRight: 12,
  },
  recommendationImage: {
    width: 140,
    height: 210,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  recommendationRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recommendationRatingText: {
    fontSize: 12,
    color: "#666",
  },
  bottomPadding: {
    height: 32,
  },
});
