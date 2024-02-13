import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger'
import reducer from "./reducers";

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})

export default store