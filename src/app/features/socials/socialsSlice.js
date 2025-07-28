import { createSlice } from "@reduxjs/toolkit";

const SOCIALS_STORAGE_KEY = "my-hub-app.socialsState";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(SOCIALS_STORAGE_KEY);
    if (serializedState === null) {
      return {
        selected: ["github", "linkedin"],
        urls: {
          github: "https://github.com/",
          linkedin: "https://linkedin.com/",
          twitter: "https://twitter.com/",
          instagram: "https://instagram.com/",
          reddit: "https://reddit.com/",
          facebook: "https://facebook.com/",
          tiktok: "https://tiktok.com/",
          youtube: "https://youtube.com/",
        },
      };
    }
    return JSON.parse(serializedState);
  } catch {
    return { selected: [], urls: {} };
  }
};

const socialsSlice = createSlice({
  name: "socials",
  initialState: loadState(),
  reducers: {
    toggleSocial: (state, action) => {
      const socialKey = action.payload;
      const index = state.selected.indexOf(socialKey);
      if (index === -1) {
        state.selected.push(socialKey);
      } else {
        state.selected.splice(index, 1);
      }
      localStorage.setItem(SOCIALS_STORAGE_KEY, JSON.stringify(state));
    },
    setSocialUrl: (state, action) => {
      const { key, url } = action.payload;
      state.urls[key] = url;
      localStorage.setItem(SOCIALS_STORAGE_KEY, JSON.stringify(state));
    },
  },
});

export const { toggleSocial, setSocialUrl } = socialsSlice.actions;

export default socialsSlice.reducer;
