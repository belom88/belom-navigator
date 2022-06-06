import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type StepState = {
  value: {
    geometry: string;
    type: "NESTED" | "MACRO";
  } | null;
};

const initialState: StepState = {
  value: null,
};

export const stepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<StepState | null>) => {
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

export const { set, unset } = stepSlice.actions;

export const selectStep = (state: RootState) => state.step.value;

export default stepSlice.reducer;
