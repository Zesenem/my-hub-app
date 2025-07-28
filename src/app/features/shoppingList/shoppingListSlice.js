import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3001/shoppingList";

export const fetchShoppingListItems = createAsyncThunk(
  "shoppingList/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Server error: Could not fetch shopping list.");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addShoppingListItem = createAsyncThunk(
  "shoppingList/addItem",
  async (item, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: item.name }),
      });
      if (!response.ok) throw new Error("Server error: Could not add item to shopping list.");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteShoppingListItem = createAsyncThunk(
  "shoppingList/deleteItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Server error: Could not delete item from shopping list.");
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShoppingListItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addShoppingListItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteShoppingListItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith("shoppingList/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("shoppingList/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("shoppingList/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export default shoppingListSlice.reducer;
