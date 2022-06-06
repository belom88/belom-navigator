import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DirectionsStep } from "../../types/directions-result";
import type { RootState } from "../store";

type HighlightState = {
  value: {
    edge?: "START" | "END";
    step?: DirectionsStep;
    type: "NESTED" | "START_END" | "STOP";
  } | null;
};

const initialState: HighlightState = {
  value: null,
};

export const highlightSlice = createSlice({
  name: "highlight",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<HighlightState | null>) => {
      if (action.payload) {
        state.value = action.payload.value;
      } else {
        state.value = null;
      }
    },
    unset: (state) => {
      state.value = null;
    },
  },
});

export const { set, unset } = highlightSlice.actions;

export const selectHighlight = (state: RootState) => state.highlight.value;

export default highlightSlice.reducer;
