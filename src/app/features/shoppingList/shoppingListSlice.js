import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const shoppingListCollectionRef = collection(db, "shoppingList");

export const fetchShoppingListItems = createAsyncThunk(
  "shoppingList/fetchShoppingListItems",
  async () => {
    const data = await getDocs(shoppingListCollectionRef);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  }
);

export const addShoppingListItem = createAsyncThunk(
  "shoppingList/addShoppingListItem",
  async (newItemData) => {
    const docRef = await addDoc(shoppingListCollectionRef, newItemData);
    return { ...newItemData, id: docRef.id };
  }
);

export const deleteShoppingListItem = createAsyncThunk(
  "shoppingList/deleteShoppingListItem",
  async (id) => {
    const shoppingListDoc = doc(db, "shoppingList", id);
    await deleteDoc(shoppingListDoc);
    return id;
  }
);

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchShoppingListItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShoppingListItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchShoppingListItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addShoppingListItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteShoppingListItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default shoppingListSlice.reducer;
