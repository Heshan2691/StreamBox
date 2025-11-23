import axios from 'axios';
import { Media, Review } from '../types/media';

// TMDB API Configuration
const TMDB_API_KEY = '408217dc76d704115a54b498189c7787';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

// Mock reviews data (can be replaced with a real reviews API later)
const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    mediaId: '1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 9,
    comment: 'Fantastic series! The historical accuracy combined with great storytelling makes it a must-watch.',
    date: '2024-01-15',
  },
  {
    id: 'r2',
    mediaId: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    rating: 10,
    comment: 'Masterpiece! Christopher Nolan at his best. Mind-bending and visually stunning.',
    date: '2024-01-20',
  },
];

// Helper function to convert TMDB data to our Media type
function convertTMDBToMedia(item: any, type: 'movie' | 'series' | 'documentary'): Media {
  const isMovie = type === 'movie';
  return {
    id: item.id.toString(),
    title: isMovie ? item.title : item.name,
    type,
    genre: [], // Will be populated separately if needed
    description: item.overview || 'No description available.',
    posterUrl: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image',
    backdropUrl: item.backdrop_path ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}` : 'https://via.placeholder.com/1920x1080?text=No+Image',
    rating: item.vote_average || 0,
    releaseYear: parseInt((isMovie ? item.release_date : item.first_air_date)?.split('-')[0] || '2024'),
    duration: item.runtime,
    seasons: item.number_of_seasons,
    episodes: item.number_of_episodes,
    director: 'Various',
    cast: [],
    isFeatured: item.vote_average >= 7.5,
  };
}

class MediaService {
  private cache: {
    movies: Media[];
    series: Media[];
    documentaries: Media[];
    lastFetch: number;
  } = {
    movies: [],
    series: [],
    documentaries: [],
    lastFetch: 0,
  };

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getAllMedia(): Promise<Media[]> {
    const [movies, series] = await Promise.all([
      this.getMediaByType('movie'),
      this.getMediaByType('series'),
    ]);
    return [...movies, ...series];
  }

  async getFeaturedMedia(): Promise<Media[]> {
    const allMedia = await this.getAllMedia();
    return allMedia.filter(m => m.isFeatured).slice(0, 5);
  }

  async getMediaById(id: string): Promise<Media | null> {
    try {
      // Try to find in cache first
      const allCached = [...this.cache.movies, ...this.cache.series, ...this.cache.documentaries];
      const cached = allCached.find(m => m.id === id);
      if (cached) return cached;

      // Try movie endpoint
      try {
        const movieResponse = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
          params: { api_key: TMDB_API_KEY },
        });
        return convertTMDBToMedia(movieResponse.data, 'movie');
      } catch {
        // If not a movie, try TV series
        const tvResponse = await axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
          params: { api_key: TMDB_API_KEY },
        });
        return convertTMDBToMedia(tvResponse.data, 'series');
      }
    } catch (error) {
      console.error('Error fetching media by ID:', error);
      return null;
    }
  }

  async getMediaByType(type: 'movie' | 'series' | 'documentary'): Promise<Media[]> {
    const now = Date.now();
    const cacheKey = type === 'series' ? 'series' : type === 'documentary' ? 'documentaries' : 'movies';

    // Return cached data if still valid
    if (this.cache[cacheKey].length > 0 && now - this.cache.lastFetch < this.CACHE_DURATION) {
      return this.cache[cacheKey];
    }

    try {
      let endpoint: string;
      let params: any = {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: 1,
      };

      if (type === 'movie') {
        endpoint = `${TMDB_BASE_URL}/movie/popular`;
      } else if (type === 'documentary') {
        endpoint = `${TMDB_BASE_URL}/discover/movie`;
        params.with_genres = 99; // Documentary genre ID
      } else {
        endpoint = `${TMDB_BASE_URL}/tv/popular`;
      }

      const response = await axios.get(endpoint, { params });
      const results = response.data.results.slice(0, 20); // Get top 20

      const media = results.map((item: any) => convertTMDBToMedia(item, type));
      
      // Update cache
      this.cache[cacheKey] = media;
      this.cache.lastFetch = now;

      return media;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  }

  async getMediaByGenre(genre: string): Promise<Media[]> {
    const allMedia = await this.getAllMedia();
    return allMedia.filter(m => m.genre.includes(genre));
  }

  async searchMedia(query: string): Promise<Media[]> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          query,
          page: 1,
        },
      });

      const results = response.data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .slice(0, 20);

      return results.map((item: any) => 
        convertTMDBToMedia(item, item.media_type === 'movie' ? 'movie' : 'series')
      );
    } catch (error) {
      console.error('Error searching media:', error);
      return [];
    }
  }

  async getReviewsForMedia(mediaId: string): Promise<Review[]> {
    // Return mock reviews for now - you can integrate a real reviews API later
    return MOCK_REVIEWS.filter(r => r.mediaId === mediaId);
  }

  async addReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: `r${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    MOCK_REVIEWS.push(newReview);
    return newReview;
  }

  async getTrendingMedia(): Promise<Media[]> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/trending/all/week`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      });

      const results = response.data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .slice(0, 10);

      return results.map((item: any) => 
        convertTMDBToMedia(item, item.media_type === 'movie' ? 'movie' : 'series')
      );
    } catch (error) {
      console.error('Error fetching trending media:', error);
      return [];
    }
  }

  async getRecommendations(favoriteGenres: string[]): Promise<Media[]> {
    // For now, return trending content
    // You can enhance this with genre-based recommendations
    return this.getTrendingMedia();
  }
}

export default new MediaService();
