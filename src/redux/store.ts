import { configureStore } from "@reduxjs/toolkit";
import stepReducer from "./slices/step-slice";

const store = configureStore({
  reducer: {
    step: stepReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
