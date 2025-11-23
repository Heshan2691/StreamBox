# TMDB API Integration

## Overview

The StreamBox app now fetches real movie and TV show data from **TMDB (The Movie Database) API** instead of using hardcoded mock data.

## Changes Made

### 1. API Configuration

- **API Provider**: TMDB (The Movie Database)
- **API Key**: `8ac6cddc9b0362102bd66c9c0b2f0d49` (free demo key)
- **Base URL**: `https://api.themoviedb.org/3`
- **Image URLs**:
  - Posters: `https://image.tmdb.org/t/p/w500`
  - Backdrops: `https://image.tmdb.org/t/p/original`

### 2. Updated Methods in `mediaService.ts`

#### `getAllMedia()`

- Fetches popular movies and TV series from TMDB
- Combines both types into a single array

#### `getMediaByType(type)`

- **Movies**: Fetches from `/movie/popular`
- **Series**: Fetches from `/tv/popular`
- **Documentaries**: Fetches from `/discover/movie` with genre filter (99)
- Returns top 20 items per type

#### `searchMedia(query)`

- Uses `/search/multi` endpoint
- Searches across both movies and TV shows
- Returns top 20 matching results

#### `getMediaById(id)`

- Tries to fetch from cache first
- Falls back to TMDB `/movie/{id}` or `/tv/{id}` endpoints
- Handles both movie and series types

#### `getTrendingMedia()`

- New method using `/trending/all/week`
- Returns top 10 trending items

#### `getFeaturedMedia()`

- Filters media with rating >= 7.5
- Returns top 5 featured items

### 3. Caching System

- **Cache Duration**: 5 minutes
- **Cached Data**: Movies, Series, Documentaries
- **Purpose**: Reduce API calls and improve performance
- **Behavior**: Returns cached data if still valid, otherwise fetches fresh data

### 4. Data Transformation

The `convertTMDBToMedia()` helper function transforms TMDB API responses to match our `Media` type:

- Handles different property names (e.g., `title` vs `name` for TV shows)
- Generates proper image URLs with TMDB base paths
- Provides fallback placeholder images
- Marks items as featured if rating >= 7.5

### 5. Review System

- Reviews still use mock data (stored in `MOCK_REVIEWS`)
- Can be replaced with a real reviews API later
- `getReviewsForMedia()` and `addReview()` remain unchanged

## API Endpoints Used

| Endpoint                         | Purpose            | Usage                |
| -------------------------------- | ------------------ | -------------------- |
| `/movie/popular`                 | Popular movies     | Home, Browse screens |
| `/tv/popular`                    | Popular TV series  | Home, Browse screens |
| `/discover/movie?with_genres=99` | Documentaries      | Browse screen        |
| `/search/multi`                  | Search movies & TV | Search screen        |
| `/movie/{id}`                    | Movie details      | Detail screen        |
| `/tv/{id}`                       | TV series details  | Detail screen        |
| `/trending/all/week`             | Trending content   | Featured section     |

## Benefits

✅ **Real Data**: Live content from TMDB's extensive database  
✅ **Always Updated**: Fresh movies and TV shows automatically  
✅ **High Quality Images**: Professional posters and backdrops  
✅ **Rich Metadata**: Accurate ratings, release dates, descriptions  
✅ **Search Functionality**: Real search across thousands of titles  
✅ **Performance**: 5-minute caching reduces API calls

## Testing the Integration

1. **Home Screen**: Should display real popular movies and series
2. **Browse Screen**: Filter by Movies/Series/Documentaries with real content
3. **Search Screen**: Search for any movie or TV show by name
4. **Detail Screen**: View detailed information about each title
5. **Featured Section**: High-rated content (>= 7.5) automatically featured

## Future Enhancements

Consider adding:

- Genre filtering with real TMDB genres
- Cast and crew information from `/movie/{id}/credits`
- Similar/recommended titles from `/movie/{id}/similar`
- Real user reviews from TMDB
- Trailers/videos from `/movie/{id}/videos`
- Multi-language support
- Your own TMDB API key (create free account at themoviedb.org)

## API Key Note

The included API key is a demo key. For production:

1. Create a free TMDB account at https://www.themoviedb.org/signup
2. Request an API key from your account settings
3. Replace the `TMDB_API_KEY` constant in `mediaService.ts`
4. Consider storing it in environment variables for security
