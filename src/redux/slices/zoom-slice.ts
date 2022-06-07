import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type HighlightState = {
  /** Zoom value */
  value: number;
};

const initialState: HighlightState = {
  value: 0,
};

export const highlightSlice = createSlice({
  name: "zoom",
  initialState,
  reducers: {
    /** Set zoom value */
    set: (state, action: PayloadAction<number>) => {
      if (action.payload) {
        state.value = action.payload;
      }
    },
  },
});

export const { set } = highlightSlice.actions;

export const selectZoom = (state: RootState) => state.zoom.value;

export default highlightSlice.reducer;
