import { createSlice } from "@reduxjs/toolkit";

const CONVERSIONS = {
  length: {
    meters: {
      feet: (val) => val * 3.28084,
      kilometers: (val) => val / 1000,
    },
    feet: {
      meters: (val) => val / 3.28084,
      kilometers: (val) => val / 3280.84,
    },
    kilometers: {
      meters: (val) => val * 1000,
      feet: (val) => val * 3280.84,
    },
  },
  temperature: {
    celsius: {
      fahrenheit: (val) => (val * 9) / 5 + 32,
      kelvin: (val) => val + 273.15,
    },
    fahrenheit: {
      celsius: (val) => ((val - 32) * 5) / 9,
      kelvin: (val) => ((val - 32) * 5) / 9 + 273.15,
    },
    kelvin: {
      celsius: (val) => val - 273.15,
      fahrenheit: (val) => ((val - 273.15) * 9) / 5 + 32,
    },
  },
  weight: {
    kilograms: {
      pounds: (val) => val * 2.20462,
      grams: (val) => val * 1000,
    },
    pounds: {
      kilograms: (val) => val / 2.20462,
      grams: (val) => val * 453.592,
    },
    grams: {
      kilograms: (val) => val / 1000,
      pounds: (val) => val / 453.592,
    },
  },
};

export const CONVERTER_CATEGORIES = {
  length: ["meters", "feet", "kilometers"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
  weight: ["kilograms", "pounds", "grams"],
};

const initialState = {
  category: "length",
  fromUnit: "meters",
  toUnit: "feet",
  inputValue: "1",
  outputValue: "3.28",
};

const converterSlice = createSlice({
  name: "converter",
  initialState,
  reducers: {
    convert: (state) => {
      const { category, fromUnit, toUnit, inputValue } = state;
      const value = parseFloat(inputValue);

      if (isNaN(value)) {
        state.outputValue = "";
        return;
      }

      if (fromUnit === toUnit) {
        state.outputValue = inputValue;
        return;
      }

      const conversionFunction = CONVERSIONS[category]?.[fromUnit]?.[toUnit];
      if (conversionFunction) {
        const result = conversionFunction(value);
        state.outputValue = Number(result.toFixed(2)).toString();
      } else {
        state.outputValue = "N/A";
      }
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      state.fromUnit = CONVERTER_CATEGORIES[state.category][0];
      state.toUnit = CONVERTER_CATEGORIES[state.category][1];
    },
    setFromUnit: (state, action) => {
      state.fromUnit = action.payload;
    },
    setToUnit: (state, action) => {
      state.toUnit = action.payload;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    swapUnits: (state) => {
      const tempUnit = state.fromUnit;
      state.fromUnit = state.toUnit;
      state.toUnit = tempUnit;
    },
  },
});

export const { convert, setCategory, setFromUnit, setToUnit, setInputValue, swapUnits } =
  converterSlice.actions;

export default converterSlice.reducer;
