import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer, { bookReducer } from './slices'

const persistConfig = {
    key: "root", // The key to store data under in the storage
    storage, // We are using localStorage to persist data
    whitelist: ["user", "isAuthenticated"], // Only persist these parts of the state (optional)
};

const persistedReducer = persistReducer(persistConfig, authReducer);
  
const store=configureStore({
    reducer:{
        auth:persistedReducer,
        book: bookReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
})

const persistor = persistStore(store)

export {store, persistor}