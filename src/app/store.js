import { configureStore } from "@reduxjs/toolkit";
import pantryReducer from "./features/pantry/pantrySlice";
import calculatorReducer from "./features/calculator/calculatorSlice";
import weatherReducer from "./features/weather/weatherSlice";
import diaryReducer from "./features/diary/diarySlice";
import dashboardReducer from "./features/dashboard/dashboardSlice";
import newsReducer from "./features/news/newsSlice";
import socialsReducer from "./features/socials/socialsSlice";
import shoppingListReducer from "./features/shoppingList/shoppingListSlice";
import converterReducer from "./features/converter/converterSlice";
import cryptoSlice from "./features/crypto/cryptoSlice";
import recipesReducer from "./features/recipes/recipesSlice";

export const store = configureStore({
  reducer: {
    pantry: pantryReducer,
    calculator: calculatorReducer,
    weather: weatherReducer,
    diary: diaryReducer,
    dashboard: dashboardReducer,
    news: newsReducer,
    socials: socialsReducer,
    shoppingList: shoppingListReducer,
    converter: converterReducer,
    crypto: cryptoSlice,
    recipes: recipesReducer,
  },
});
