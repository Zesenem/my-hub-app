import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCryptoData = createAsyncThunk(
  "crypto/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const ids = "bitcoin,ethereum,dogecoin";
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Failed to fetch crypto data. The API may be down or rate-limited.");

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: {},
  status: "idle",
  error: null,
};

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default cryptoSlice.reducer;