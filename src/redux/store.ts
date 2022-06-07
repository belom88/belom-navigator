import { configureStore } from "@reduxjs/toolkit";
import highlightReducer from "./slices/highlight-slice";
import zoomReducer from "./slices/zoom-slice";

const store = configureStore({
  reducer: {
    highlight: highlightReducer,
    zoom: zoomReducer
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
