import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import mediaService from '../../api/mediaService';
import { Media } from '../../types/media';
import { searchMedia } from './searchSlice';

interface MediaState {
  allMedia: Media[];
  featuredMedia: Media[];
  trendingMedia: Media[];
  moviesList: Media[];
  seriesList: Media[];
  documentariesList: Media[];
  loading: boolean;
  error: string | null;
}

const initialState: MediaState = {
  allMedia: [],
  featuredMedia: [],
  trendingMedia: [],
  moviesList: [],
  seriesList: [],
  documentariesList: [],
  loading: false,
  error: null,
};

export const fetchAllMedia = createAsyncThunk('media/fetchAll', async () => {
  return await mediaService.getAllMedia();
});

export const fetchFeaturedMedia = createAsyncThunk('media/fetchFeatured', async () => {
  return await mediaService.getFeaturedMedia();
});

export const fetchTrendingMedia = createAsyncThunk('media/fetchTrending', async () => {
  return await mediaService.getTrendingMedia();
});

export const fetchMovies = createAsyncThunk('media/fetchMovies', async () => {
  return await mediaService.getMediaByType('movie');
});

export const fetchSeries = createAsyncThunk('media/fetchSeries', async () => {
  return await mediaService.getMediaByType('series');
});

export const fetchDocumentaries = createAsyncThunk('media/fetchDocumentaries', async () => {
  return await mediaService.getMediaByType('documentary');
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all media
    builder
      .addCase(fetchAllMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMedia.fulfilled, (state, action: PayloadAction<Media[]>) => {
        state.loading = false;
        state.allMedia = action.payload;
      })
      .addCase(fetchAllMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch media';
      });

    // Fetch featured media
    builder
      .addCase(fetchFeaturedMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedMedia.fulfilled, (state, action: PayloadAction<Media[]>) => {
        state.loading = false;
        state.featuredMedia = action.payload;
      })
      .addCase(fetchFeaturedMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch featured media';
      });

    // Fetch trending media
    builder
      .addCase(fetchTrendingMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingMedia.fulfilled, (state, action: PayloadAction<Media[]>) => {
        state.loading = false;
        state.trendingMedia = action.payload;
      })
      .addCase(fetchTrendingMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trending media';
      });

    // Fetch movies
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Media[]>) => {
        state.loading = false;
        state.moviesList = action.payload;
        // Update allMedia with unique items
        const newItems = action.payload.filter(
          (movie) => !state.allMedia.some((m) => m.id === movie.id)
        );
        state.allMedia = [...state.allMedia, ...newItems];
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      });

    // Fetch series
    builder
      .addCase(fetchSeries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSeries.fulfilled, (state, action: PayloadAction<Media[]>) => {
        state.loading = false;
        state.seriesList = action.payload;
        // Update allMedia with unique items
        const newItems = action.payload.filter(
          (series) => !state.allMedia.some((m) => m.id === series.id)
        );
        state.allMedia = [...state.allMedia, ...newItems];
      })
      .addCase(fetchSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch series';
      });

    // Fetch documentaries
    builder
      .addCase(fetchDocumentaries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocumentaries.fulfilled, (state, action: PayloadAction<Media[]>) => {
        state.loading = false;
        state.documentariesList = action.payload;
        // Update allMedia with unique items
        const newItems = action.payload.filter(
          (doc) => !state.allMedia.some((m) => m.id === doc.id)
        );
        state.allMedia = [...state.allMedia, ...newItems];
      })
      .addCase(fetchDocumentaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch documentaries';
      });

    // Listen to search results and add them to allMedia
    builder.addCase(searchMedia.fulfilled, (state, action: PayloadAction<Media[]>) => {
      // Add search results to allMedia if they don't already exist
      const newItems = action.payload.filter(
        (searchItem) => !state.allMedia.some((m) => m.id === searchItem.id)
      );
      if (newItems.length > 0) {
        state.allMedia = [...state.allMedia, ...newItems];
      }
    });
  },
});

export const { clearError } = mediaSlice.actions;
export default mediaSlice.reducer;
