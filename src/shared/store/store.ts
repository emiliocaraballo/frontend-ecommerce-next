import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { api } from './api'; // Asegúrate de importar la configuración de RTK Query
import userReducer from './slices/userSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Reducers que quieres persistir
};

// Reducer combinado
const rootReducer = combineReducers({
  user: userReducer,
  [api.reducerPath]: api.reducer, // Agrega el reducer de RTK Query
});

// Aplica persistencia solo al reducer de `user`
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configura el store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Deshabilita chequeo de serialización para redux-persist
    }).concat(api.middleware), // Agrega el middleware de RTK Query
});

// Configura el persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
