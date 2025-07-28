import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const RECIPES_URL = "http://localhost:3001/recipes";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes", async () => {
  const response = await axios.get(RECIPES_URL);
  return response.data;
});

export const addRecipe = createAsyncThunk("recipes/addRecipe", async (recipeData) => {
  const response = await axios.post(RECIPES_URL, recipeData);
  return response.data;
});

export const deleteRecipe = createAsyncThunk("recipes/deleteRecipe", async (recipeId) => {
  await axios.delete(`${RECIPES_URL}/${recipeId}`);
  return recipeId;
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addRecipe.rejected, (action) => {
        console.error("Failed to add recipe:", action.error.message);
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteRecipe.rejected, (action) => {
        console.error("Failed to delete recipe:", action.error.message);
      });
  },
});

export default recipesSlice.reducer;
