import { configureStore } from "@reduxjs/toolkit";
import highlightReducer from "./slices/highlight-slice";
import zoomReducer from "./slices/zoom-slice";

const store = configureStore({
  reducer: {
    // Highlight object to select/unselect markers on the map and elements on the router panel
    highlight: highlightReducer,
    // Zoom tracking - to switch on the route's overview mode
    zoom: zoomReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
