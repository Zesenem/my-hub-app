import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPantryItems = createAsyncThunk(
  "pantry/fetchPantryItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/pantry");
      if (!response.ok) throw new Error("Server error: Could not fetch pantry items.");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPantryItem = createAsyncThunk(
  "pantry/addPantryItem",
  async (newItem, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error("Server error: Could not add item.");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePantryItem = createAsyncThunk(
  "pantry/updatePantryItem",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/pantry/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Server error: Could not update item.");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePantryItem = createAsyncThunk(
  "pantry/deletePantryItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/pantry/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Server error: Could not delete item.");
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pantrySlice = createSlice({
  name: "pantry",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPantryItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addPantryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePantryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deletePantryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith("pantry/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("pantry/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("pantry/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export default pantrySlice.reducer;
