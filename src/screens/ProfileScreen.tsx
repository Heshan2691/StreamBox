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
import { Colors } from "../../constants/theme";
import { useAppTheme } from "../hooks/useAppTheme";
import { logoutUser } from "../redux/slices/authSlice";
import { selectCurrentUserFavorites } from "../redux/slices/favoritesSlice";
import { setThemeMode, ThemeMode } from "../redux/slices/themeSlice";
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
  const { isDark, mode } = useAppTheme();
  const colors = isDark ? Colors.dark : Colors.light;

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

  const handleThemeChange = (newMode: ThemeMode) => {
    dispatch(setThemeMode(newMode));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        {user?.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: isDark ? "#1a3a52" : "#E8F4FF" },
            ]}
          >
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
        )}
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={[styles.userEmail, { color: colors.primary }]}>
          @{user?.username}
        </Text>
        <Text style={[styles.userEmailSecondary, { color: colors.icon }]}>
          {user?.email}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {favoriteIds.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>
            Favorites
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {watchlistItems.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>
            Watchlist
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {preferences.watchHistory.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>
            Watched
          </Text>
        </View>
      </View>

      {/* Theme Settings */}
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Theme Settings
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.icon }]}>
          Choose your preferred color theme
        </Text>
        <View style={styles.themeContainer}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
              mode === "light" && styles.themeOptionSelected,
              mode === "light" && { borderColor: colors.primary },
            ]}
            onPress={() => handleThemeChange("light")}
          >
            <Ionicons
              name="sunny"
              size={24}
              color={mode === "light" ? colors.primary : colors.icon}
            />
            <Text style={[styles.themeText, { color: colors.text }]}>
              Light
            </Text>
            {mode === "light" && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
              mode === "dark" && styles.themeOptionSelected,
              mode === "dark" && { borderColor: colors.primary },
            ]}
            onPress={() => handleThemeChange("dark")}
          >
            <Ionicons
              name="moon"
              size={24}
              color={mode === "dark" ? colors.primary : colors.icon}
            />
            <Text style={[styles.themeText, { color: colors.text }]}>Dark</Text>
            {mode === "dark" && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
              mode === "auto" && styles.themeOptionSelected,
              mode === "auto" && { borderColor: colors.primary },
            ]}
            onPress={() => handleThemeChange("auto")}
          >
            <Ionicons
              name="phone-portrait"
              size={24}
              color={mode === "auto" ? colors.primary : colors.icon}
            />
            <Text style={[styles.themeText, { color: colors.text }]}>Auto</Text>
            {mode === "auto" && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Favorite Genres */}
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Favorite Genres
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.icon }]}>
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
                  { backgroundColor: isDark ? "#2a2a2a" : "#F5F5F5" },
                  isSelected && { backgroundColor: colors.primary },
                ]}
                onPress={() => handleToggleGenre(genre)}
              >
                <Text
                  style={[
                    styles.genreText,
                    { color: isSelected ? "#FFF" : colors.icon },
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
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          About StreamBox
        </Text>
        <View
          style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.infoText, { color: colors.text }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Entertainment & Media App
          </Text>
          <Text style={[styles.infoDescription, { color: colors.icon }]}>
            Discover and explore your favorite movies, series, and
            documentaries. Save favorites, create watchlists, and never miss
            great content.
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <View style={[styles.section, { borderTopColor: colors.border }]}>
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
  themeContainer: {
    gap: 12,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  themeOptionSelected: {
    borderWidth: 2,
  },
  themeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
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
