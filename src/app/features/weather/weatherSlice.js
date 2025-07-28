import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchWeatherByCity = createAsyncThunk(
  "weather/fetchByCity",
  async (city, { rejectWithValue }) => {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${BASE_URL}/weather?q=${city}&appid=${apiKey}&units=metric`),
        fetch(`${BASE_URL}/forecast?q=${city}&appid=${apiKey}&units=metric`),
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        const errorData = !currentResponse.ok
          ? await currentResponse.json()
          : await forecastResponse.json();
        throw new Error(errorData.message || "City not found.");
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      return { current: currentData, forecast: forecastData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeatherByCoords = createAsyncThunk(
  "weather/fetchByCoords",
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
        fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        const errorData = !currentResponse.ok
          ? await currentResponse.json()
          : await forecastResponse.json();
        throw new Error(errorData.message || "Could not fetch weather data.");
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      return { current: currentData, forecast: forecastData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: null,
  status: "idle",
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith("weather/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("weather/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("weather/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
          state.data = null;
        }
      );
  },
});

export default weatherSlice.reducer;
