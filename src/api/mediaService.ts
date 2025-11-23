import axios from 'axios';
import { CastMember, Media, Review } from '../types/media';

// TMDB API Configuration
const TMDB_API_KEY = '408217dc76d704115a54b498189c7787';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
const TMDB_PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';

// Genre mappings cache
let genreCache: { [key: number]: string } = {};
let genreCacheLoaded = false;

// Load genre mappings from TMDB
async function loadGenres() {
  if (genreCacheLoaded) return;
  
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: { api_key: TMDB_API_KEY, language: 'en-US' },
      }),
      axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
        params: { api_key: TMDB_API_KEY, language: 'en-US' },
      }),
    ]);

    const allGenres = [...movieGenres.data.genres, ...tvGenres.data.genres];
    allGenres.forEach((genre: any) => {
      genreCache[genre.id] = genre.name;
    });
    genreCacheLoaded = true;
  } catch (error) {
    console.error('Error loading genres:', error);
  }
}

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

// Helper function to convert TMDB review to our Review type
function convertTMDBReview(tmdbReview: any, mediaId: string): Review {
  // Convert TMDB rating (1-10) to our format, if available
  const rating = tmdbReview.author_details?.rating 
    ? Math.round(tmdbReview.author_details.rating) 
    : 8; // Default rating if not provided
  
  return {
    id: tmdbReview.id,
    mediaId,
    userId: tmdbReview.author_details?.username || tmdbReview.author,
    userName: tmdbReview.author,
    rating,
    comment: tmdbReview.content.length > 500 
      ? tmdbReview.content.substring(0, 497) + '...' 
      : tmdbReview.content,
    date: tmdbReview.created_at.split('T')[0],
  };
}

// Helper function to convert TMDB data to our Media type
function convertTMDBToMedia(item: any, type: 'movie' | 'series' | 'documentary'): Media {
  const isMovie = type === 'movie';
  
  // Map genre IDs to names
  const genreNames = (item.genre_ids || [])
    .map((id: number) => genreCache[id])
    .filter((name: string) => name !== undefined);
  
  return {
    id: item.id.toString(),
    title: isMovie ? item.title : item.name,
    type,
    genre: genreNames.length > 0 ? genreNames : ['Unknown'],
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
      // Load genres first
      await loadGenres();
      
      // Check cache only if it has detailed info (cast populated)
      const allCached = [...this.cache.movies, ...this.cache.series, ...this.cache.documentaries];
      const cached = allCached.find(m => m.id === id);
      if (cached && cached.cast && cached.cast.length > 0) {
        return cached;
      }

      // Try movie endpoint
      try {
        const [movieResponse, creditsResponse] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
            params: { api_key: TMDB_API_KEY },
          }),
          axios.get(`${TMDB_BASE_URL}/movie/${id}/credits`, {
            params: { api_key: TMDB_API_KEY },
          }),
        ]);
        
        // For detail endpoint, TMDB returns genres as array of objects with id and name
        // Convert to genre_ids format for convertTMDBToMedia
        const movieData = {
          ...movieResponse.data,
          genre_ids: movieResponse.data.genres?.map((g: any) => g.id) || [],
        };
        
        const media = convertTMDBToMedia(movieData, 'movie');
        
        // Add cast information with images
        if (creditsResponse.data.cast) {
          media.cast = creditsResponse.data.cast
            .slice(0, 10)
            .map((actor: any): CastMember => ({
              name: actor.name,
              character: actor.character,
              profileUrl: actor.profile_path 
                ? `${TMDB_PROFILE_BASE}${actor.profile_path}` 
                : 'https://via.placeholder.com/185x278?text=No+Image',
            }));
        }
        
        // Add director information
        if (creditsResponse.data.crew) {
          const director = creditsResponse.data.crew.find(
            (person: any) => person.job === 'Director'
          );
          if (director) {
            media.director = director.name;
          }
        }
        
        return media;
      } catch {
        // If not a movie, try TV series
        const [tvResponse, creditsResponse] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
            params: { api_key: TMDB_API_KEY },
          }),
          axios.get(`${TMDB_BASE_URL}/tv/${id}/credits`, {
            params: { api_key: TMDB_API_KEY },
          }),
        ]);
        
        // For detail endpoint, TMDB returns genres as array of objects with id and name
        // Convert to genre_ids format for convertTMDBToMedia
        const tvData = {
          ...tvResponse.data,
          genre_ids: tvResponse.data.genres?.map((g: any) => g.id) || [],
        };
        
        const media = convertTMDBToMedia(tvData, 'series');
        
        // Add cast information with images
        if (creditsResponse.data.cast) {
          media.cast = creditsResponse.data.cast
            .slice(0, 10)
            .map((actor: any): CastMember => ({
              name: actor.name,
              character: actor.character,
              profileUrl: actor.profile_path 
                ? `${TMDB_PROFILE_BASE}${actor.profile_path}` 
                : 'https://via.placeholder.com/185x278?text=No+Image',
            }));
        }
        
        // Add creator information as director for TV series
        if (tvResponse.data.created_by && tvResponse.data.created_by.length > 0) {
          media.director = tvResponse.data.created_by
            .map((creator: any) => creator.name)
            .join(', ');
        }
        
        return media;
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
      // Load genres first
      await loadGenres();
      
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
      // Load genres first
      await loadGenres();
      
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
    try {
      // Try to fetch from movie reviews first
      let response;
      try {
        response = await axios.get(`${TMDB_BASE_URL}/movie/${mediaId}/reviews`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'en-US',
            page: 1,
          },
        });
      } catch {
        // If not a movie, try TV series
        response = await axios.get(`${TMDB_BASE_URL}/tv/${mediaId}/reviews`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'en-US',
            page: 1,
          },
        });
      }

      const tmdbReviews = response.data.results || [];
      const reviews = tmdbReviews.map((review: any) => 
        convertTMDBReview(review, mediaId)
      );

      // Add any user-submitted reviews from local storage
      const localReviews = MOCK_REVIEWS.filter(r => r.mediaId === mediaId);
      
      return [...reviews, ...localReviews];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Return only local reviews if API fails
      return MOCK_REVIEWS.filter(r => r.mediaId === mediaId);
    }
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
      // Load genres first
      await loadGenres();
      
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

  async getSimilarMedia(mediaId: string, mediaType: 'movie' | 'series'): Promise<Media[]> {
    try {
      // Load genres first
      await loadGenres();
      
      const endpoint = mediaType === 'movie' 
        ? `${TMDB_BASE_URL}/movie/${mediaId}/similar`
        : `${TMDB_BASE_URL}/tv/${mediaId}/similar`;

      const response = await axios.get(endpoint, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: 1,
        },
      });

      const results = response.data.results.slice(0, 10);
      return results.map((item: any) => convertTMDBToMedia(item, mediaType));
    } catch (error) {
      console.error('Error fetching similar media:', error);
      return [];
    }
  }
}

export default new MediaService();

