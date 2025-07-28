import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  display: "0",
  operand: null,
  operator: null,
  waitingForOperand: true,
};

const performCalculation = (operand, operator, currentVal) => {
  if (operator === "/" && currentVal === 0) {
    return "Error";
  }

  const calculations = {
    "/": (prev, next) => prev / next,
    "*": (prev, next) => prev * next,
    "+": (prev, next) => prev + next,
    "-": (prev, next) => prev - next,
  };
  return calculations[operator](operand, currentVal);
};

const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    digitPressed: (state, action) => {
      const { digit } = action.payload;
      if (state.waitingForOperand || state.display === "Error") {
        state.display = String(digit);
        state.waitingForOperand = false;
      } else {
        if (digit === "." && state.display.includes(".")) return;
        state.display =
          state.display === "0" && digit !== "." ? String(digit) : state.display + digit;
      }
    },
    operatorPressed: (state, action) => {
      const { operator } = action.payload;
      const inputValue = parseFloat(state.display);

      if (state.display === "Error") return;

      if (state.operand === null) {
        state.operand = inputValue;
      } else if (state.operator) {
        const result = performCalculation(state.operand, state.operator, inputValue);
        state.operand = result;
        state.display = String(result);
      }
      state.waitingForOperand = true;
      state.operator = operator;
    },
    equalsPressed: (state) => {
      if (state.operator && state.operand !== null) {
        const result = performCalculation(state.operand, state.operator, parseFloat(state.display));
        state.display = String(result);
        state.operand = null;
        state.operator = null;
        state.waitingForOperand = true;
      }
    },
    clearPressed: (state) => {
      Object.assign(state, initialState);
    },
    toggleSignPressed: (state) => {
      if (state.display !== "Error") {
        state.display = String(parseFloat(state.display) * -1);
      }
    },
    percentPressed: (state) => {
      if (state.display !== "Error") {
        state.display = String(parseFloat(state.display) / 100);
      }
    },
  },
});

export const {
  digitPressed,
  operatorPressed,
  equalsPressed,
  clearPressed,
  toggleSignPressed,
  percentPressed,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;