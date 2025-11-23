import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import mediaService from '../../api/mediaService';
import { Media } from '../../types/media';

interface SearchState {
  query: string;
  results: Media[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
};

export const searchMedia = createAsyncThunk(
  'search/searchMedia',
  async (query: string) => {
    return await mediaService.searchMedia(query);
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMedia.fulfilled, (state, action: PayloadAction<Media[]>) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
