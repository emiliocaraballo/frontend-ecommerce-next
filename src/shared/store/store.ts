import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, Middleware } from 'redux';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { api } from './api';
import userReducer from './slices/userSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'api'],
};

// Reducer combinado
const rootReducer = combineReducers({
  user: userReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configura el store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    
    return middlewares.concat(api.middleware as Middleware);
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
