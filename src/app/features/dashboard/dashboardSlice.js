import { createSlice } from "@reduxjs/toolkit";

const DASHBOARD_STORAGE_KEY = "my-hub-app.dashboardState";

const DEFAULT_WIDGETS = [
  "weather",
  "news",
  "kitchen",
  "calculator",
  "diary",
  "game",
  "converter",
  "crypto",
  "events",
];

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (serializedState === null) {
      return {
        visibleWidgets: ["weather", "news", "kitchen"],
        widgetOrder: DEFAULT_WIDGETS,
        maximizedWidget: null,
      };
    }
    const state = JSON.parse(serializedState);
    const fullOrder = [...new Set([...state.widgetOrder, ...DEFAULT_WIDGETS])];
    state.widgetOrder = fullOrder;
    if (state.maximizedWidget === undefined) {
      state.maximizedWidget = null;
    }
    return state;
  } catch (err) {
    console.error("Could not load dashboard state from localStorage", err);
    return {
      visibleWidgets: [],
      widgetOrder: DEFAULT_WIDGETS,
      maximizedWidget: null,
    };
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(DASHBOARD_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Could not save dashboard state to localStorage", err);
  }
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: loadState(),
  reducers: {
    toggleWidget: (state, action) => {
      const widgetName = action.payload;
      const widgetIndex = state.visibleWidgets.indexOf(widgetName);

      if (widgetIndex === -1) {
        state.visibleWidgets.push(widgetName);
      } else {
        state.visibleWidgets.splice(widgetIndex, 1);
      }
      saveState(state);
    },
    reorderWidgets: (state, action) => {
      state.widgetOrder = action.payload;
      saveState(state);
    },
    setMaximizedWidget: (state, action) => {
      state.maximizedWidget = action.payload;
      saveState(state);
    },
    clearMaximizedWidget: (state) => {
      state.maximizedWidget = null;
      saveState(state);
    },
  },
});

export const { toggleWidget, reorderWidgets, setMaximizedWidget, clearMaximizedWidget } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
