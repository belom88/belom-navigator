import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DirectionsStep } from "../../types/directions-result";
import type { RootState } from "../store";

/**
 * 3 types of objects can be highlighted:
 * * Turns of walking step ("NESTED")
 * * Subway stations or bus stops (transit stops or "STOP"s)
 * * Start and end of the whole route ("START_END")
 */
type HighlightState = {
  value: {
    /** Edge of the highlighted object. Applicable for "START_END" and "STOP" */
    edge?: "START" | "END";
    /** Step of highlighted object. Applicable for "NESTED" and "STOP" */
    step?: DirectionsStep;
    /** Type of highlighted object */
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
    /** Set highlighted object */
    set: (state, action: PayloadAction<HighlightState | null>) => {
      if (action.payload) {
        state.value = action.payload.value;
      } else {
        state.value = null;
      }
    },
    /** Unset previously selected object - to remove any selection */
    unset: (state) => {
      state.value = null;
    },
  },
});

export const { set, unset } = highlightSlice.actions;

export const selectHighlight = (state: RootState) => state.highlight.value;

export default highlightSlice.reducer;
