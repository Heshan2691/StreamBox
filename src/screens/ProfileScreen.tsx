import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { selectCurrentUserFavorites } from "../redux/slices/favoritesSlice";
import {
  addFavoriteGenre,
  removeFavoriteGenre,
} from "../redux/slices/userSlice";
import { selectCurrentUserWatchlist } from "../redux/slices/watchlistSlice";
import { AppDispatch, RootState } from "../redux/store";

const AVAILABLE_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "History",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Documentary",
  "Biography",
];

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { preferences } = useSelector((state: RootState) => state.user);
  const favoriteIds = useSelector(selectCurrentUserFavorites);
  const watchlistItems = useSelector(selectCurrentUserWatchlist);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  const handleToggleGenre = (genre: string) => {
    if (preferences.favoriteGenres.includes(genre)) {
      dispatch(removeFavoriteGenre(genre));
    } else {
      dispatch(addFavoriteGenre(genre));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        {user?.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color="#007AFF" />
          </View>
        )}
        <Text style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.userEmail}>@{user?.username}</Text>
        <Text style={styles.userEmailSecondary}>{user?.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{favoriteIds.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{watchlistItems.length}</Text>
          <Text style={styles.statLabel}>Watchlist</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {preferences.watchHistory.length}
          </Text>
          <Text style={styles.statLabel}>Watched</Text>
        </View>
      </View>

      {/* Favorite Genres */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Genres</Text>
        <Text style={styles.sectionDescription}>
          Select your favorite genres to get personalized recommendations
        </Text>
        <View style={styles.genresContainer}>
          {AVAILABLE_GENRES.map((genre) => {
            const isSelected = preferences.favoriteGenres.includes(genre);
            return (
              <TouchableOpacity
                key={genre}
                style={[
                  styles.genreChip,
                  isSelected && styles.genreChipSelected,
                ]}
                onPress={() => handleToggleGenre(genre)}
              >
                <Text
                  style={[
                    styles.genreText,
                    isSelected && styles.genreTextSelected,
                  ]}
                >
                  {genre}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About StreamBox</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Version 1.0.0</Text>
          <Text style={styles.infoText}>Entertainment & Media App</Text>
          <Text style={styles.infoDescription}>
            Discover and explore your favorite movies, series, and
            documentaries. Save favorites, create watchlists, and never miss
            great content.
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF4458" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 4,
  },
  userEmailSecondary: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    padding: 4,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
    minWidth: 200,
    textAlign: "center",
  },
  saveButton: {
    padding: 4,
  },
  cancelButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: "row",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#F0F0F0",
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    gap: 6,
  },
  genreChipSelected: {
    backgroundColor: "#007AFF",
  },
  genreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  genreTextSelected: {
    color: "#FFF",
  },
  infoCard: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#FF4458",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4458",
  },
  bottomPadding: {
    height: 32,
  },
});
