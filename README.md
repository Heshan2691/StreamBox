# StreamBox - Entertainment & Media App

A React Native entertainment and media streaming application built with Expo, featuring a comprehensive media browsing experience with favorites, watchlists, and user reviews.

## 🎯 Features

### Core Features

- **Browse Media Content**: Movies, TV Series, and Documentaries
- **Search Functionality**: Search across all content with real-time results
- **Favorites & Watchlist**: Save and organize your favorite content
- **User Reviews**: Rate and review content with form validation (Formik + Yup)
- **Personalized Recommendations**: Based on favorite genres
- **User Profile**: Manage preferences and view statistics

### Technical Features

- ✅ Redux Toolkit for state management
- ✅ Redux Persist for data persistence
- ✅ Navigation with React Navigation (Bottom Tabs + Stack)
- ✅ Form validation with Formik and Yup
- ✅ TypeScript for type safety
- ✅ Responsive UI with custom components

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **Forms & Validation**: Formik + Yup
- **Persistence**: Redux Persist with AsyncStorage
- **UI Components**: Custom components with Expo Vector Icons, Linear Gradient
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.17.0 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npx expo start
```

3. Run on your device:

- Scan the QR code with Expo Go app (Android/iOS)
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web

## 📁 Project Structure

```
src/
├── api/
│   └── mediaService.ts          # API service for media data
├── components/
│   ├── CategoryRow.tsx          # Horizontal/grid media list
│   ├── FeaturedBanner.tsx       # Featured content banner
│   ├── MediaCard.tsx            # Media item card
│   └── SearchBar.tsx            # Search input component
├── navigation/
│   └── RootNavigator.tsx        # App navigation setup
├── redux/
│   ├── store.ts                 # Redux store configuration
│   └── slices/
│       ├── favoritesSlice.ts    # Favorites state management
│       ├── mediaSlice.ts        # Media content state
│       ├── searchSlice.ts       # Search state
│       ├── userSlice.ts         # User preferences
│       └── watchlistSlice.ts    # Watchlist state
├── screens/
│   ├── BrowseScreen.tsx         # Browse by categories
│   ├── FavoritesScreen.tsx      # Favorites & watchlist
│   ├── HomeScreen.tsx           # Home feed
│   ├── MediaDetailScreen.tsx    # Detail view with reviews
│   ├── ProfileScreen.tsx        # User profile
│   └── SearchScreen.tsx         # Search interface
└── types/
    └── media.ts                 # TypeScript type definitions
```

## 📱 Screens

### 1. Home Screen

- Featured banner with trending content
- Trending Now section
- Popular Movies section
- Top Series section
- Pull-to-refresh functionality

### 2. Browse Screen

- Filter content by type (All, Movies, Series, Documentaries)
- Grid layout for content browsing
- Toggle favorite on individual items

### 3. Search Screen

- Real-time search with debouncing (300ms)
- Search across title, description, genre, and cast
- Empty state for no results

### 4. Favorites Screen

- View all favorited content
- View watchlist items
- Quick access to saved content

### 5. Profile Screen

- User statistics (Favorites, Watchlist, Watch History)
- Edit user name
- Manage favorite genres
- View app information

### 6. Media Detail Screen

- Full media information
- Poster and backdrop images
- Add to favorites/watchlist
- Submit reviews with validation
- View existing reviews
- Rating system (1-10)

## 🔄 State Management

### Redux Slices

#### Media Slice

- Stores all media content
- Categories: Featured, Trending, Movies, Series, Documentaries
- Async thunks for data fetching

#### Favorites Slice

- Manages favorite media IDs
- Toggle favorite functionality
- Persisted to AsyncStorage

#### Watchlist Slice

- Manages watchlist items with timestamps
- Toggle watchlist functionality
- Persisted to AsyncStorage

#### Search Slice

- Handles search queries
- Stores search results
- Loading and error states

#### User Slice

- User name and preferences
- Favorite genres
- Watch history (last 50 items)
- Persisted to AsyncStorage

## ✅ Form Validation

The review form in `MediaDetailScreen` uses Formik and Yup:

```typescript
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
```

## 🗺 Navigation Structure

```
Root Stack Navigator
└── Main (Tab Navigator)
    ├── Home Tab
    ├── Browse Tab
    ├── Search Tab
    ├── Favorites Tab
    └── Profile Tab
└── Media Detail (Modal Stack)
```

## 🎨 UI Components

### MediaCard

- Poster image with rating badge
- Favorite button overlay
- Type indicator (Movie/Series/Documentary)

### FeaturedBanner

- Large backdrop image
- Gradient overlay
- Play button
- Rating and metadata

### CategoryRow

- Horizontal scrolling list
- Support for grid layout
- Favorite toggle per item

### SearchBar

- Custom search input
- Clear button
- Debounced input

## 💾 Data Persistence

Using Redux Persist with AsyncStorage:

- **Persisted**: Favorites, Watchlist, User preferences
- **Not Persisted**: Media content, Search results (fetched fresh)

## 🔌 API Service

Mock API service provides:

- 8 sample media items (movies, series, documentaries)
- Search functionality
- Review management
- Category filtering
- Recommendations based on genres

## 📦 Dependencies

```json
{
  "@expo/vector-icons": "^15.0.3",
  "@react-navigation/bottom-tabs": "^7.8.6",
  "@react-navigation/native": "^7.1.21",
  "@react-navigation/native-stack": "^7.7.0",
  "@reduxjs/toolkit": "^2.10.1",
  "@react-native-async-storage/async-storage": "latest",
  "axios": "^1.13.2",
  "expo": "~54.0.25",
  "expo-linear-gradient": "latest",
  "formik": "^2.4.9",
  "react-redux": "^9.2.0",
  "redux-persist": "^6.0.0",
  "yup": "^1.7.1"
}
```

## 🎓 Assignment Requirements Met

✅ **Topic**: Entertainment & Media
✅ **State Management**: Redux Toolkit with multiple slices
✅ **Data Persistence**: Redux Persist with AsyncStorage
✅ **Navigation**: Tab Navigator + Stack Navigator
✅ **Form Validation**: Formik + Yup in review form
✅ **API Integration**: Mock API service
✅ **TypeScript**: Full TypeScript support
✅ **Custom Components**: MediaCard, CategoryRow, FeaturedBanner, SearchBar
✅ **Multiple Screens**: 6 main screens + detail modal

## 📄 License

MIT

---

**Built with ❤️ using React Native and Expo**
