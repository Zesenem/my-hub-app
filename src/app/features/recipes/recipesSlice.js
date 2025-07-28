import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OpenAI } from "openai";
import { db } from "../../../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const initialState = {
  items: [],
  suggestions: [],
  status: "idle",
  error: null,
};

const recipesCollectionRef = collection(db, "recipes");

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const fetchAiRecipeSuggestion = createAsyncThunk(
  "recipes/fetchAiRecipeSuggestion",
  async (pantryItems, { rejectWithValue }) => {
    const prompt = `Based on the following pantry items: ${pantryItems.join(
      ", "
    )}, suggest a recipe. Provide the recipe name, a short description, a list of ingredients (separating what I have and what I'm missing), and the instructions. Format the response as a JSON object with the following keys: recipeName, description, ingredients (with "have" and "missing" sub-keys), and instructions.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      const recipe = JSON.parse(response.choices[0].message.content);
      return [recipe];
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes", async () => {
  const data = await getDocs(recipesCollectionRef);
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
});

export const addRecipe = createAsyncThunk("recipes/addRecipe", async (recipeData) => {
  const docRef = await addDoc(recipesCollectionRef, recipeData);
  return { ...recipeData, id: docRef.id };
});

export const deleteRecipe = createAsyncThunk("recipes/deleteRecipe", async (recipeId) => {
  const recipeDoc = doc(db, "recipes", recipeId);
  await deleteDoc(recipeDoc);
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
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(fetchAiRecipeSuggestion.pending, (state) => {
        state.status = "loading";
        state.suggestions = [];
      })
      .addCase(fetchAiRecipeSuggestion.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.suggestions = action.payload;
      })
      .addCase(fetchAiRecipeSuggestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default recipesSlice.reducer;
