import { configureStore } from "@reduxjs/toolkit";
import highlightReducer from "./slices/highlight-slice";

const store = configureStore({
  reducer: {
    highlight: highlightReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
