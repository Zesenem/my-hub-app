import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const pantryCollectionRef = collection(db, "pantry");

export const fetchPantryItems = createAsyncThunk("pantry/fetchPantryItems", async () => {
  const data = await getDocs(pantryCollectionRef);
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
});

export const addPantryItem = createAsyncThunk("pantry/addPantryItem", async (newItemData) => {
  const docRef = await addDoc(pantryCollectionRef, newItemData);
  return { ...newItemData, id: docRef.id };
});

export const updatePantryItem = createAsyncThunk(
  "pantry/updatePantryItem",
  async ({ id, updatedData }) => {
    const pantryDoc = doc(db, "pantry", id);
    await updateDoc(pantryDoc, updatedData);
    return { id, updatedData };
  }
);

export const deletePantryItem = createAsyncThunk("pantry/deletePantryItem", async (id) => {
  const pantryDoc = doc(db, "pantry", id);
  await deleteDoc(pantryDoc);
  return id;
});

const pantrySlice = createSlice({
  name: "pantry",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPantryItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPantryItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPantryItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addPantryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePantryItem.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const existingItem = state.items.find((item) => item.id === id);
        if (existingItem) {
          Object.assign(existingItem, updatedData);
        }
      })
      .addCase(deletePantryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default pantrySlice.reducer;
