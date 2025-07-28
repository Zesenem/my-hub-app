import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

export const fetchTopHeadlines = createAsyncThunk(
  "news/fetchTopHeadlines",
  async (_, { rejectWithValue }) => {
    try {
      const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=10&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.errors) {
        throw new Error(data.errors ? data.errors[0] : "Could not fetch news");
      }
      return data.articles;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  articles: [],
  status: "idle",
  error: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopHeadlines.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTopHeadlines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(fetchTopHeadlines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;
