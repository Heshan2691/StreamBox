export interface Media {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'documentary';
  genre: string[];
  description: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  releaseYear: number;
  duration?: number; // in minutes for movies
  seasons?: number; // for series
  episodes?: number; // for series
  director?: string;
  cast: string[];
  trailerUrl?: string;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  mediaId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserPreferences {
  favoriteGenres: string[];
  watchHistory: string[];
}

export interface WatchlistItem {
  mediaId: string;
  addedDate: string;
}

export interface Category {
  id: string;
  name: string;
  items: Media[];
}
