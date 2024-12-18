/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface UserState {
  id: number;
  name: string;
  documentNumber: string;
  documentType: string;
  lastName: string;
  email: string;
  phone: string;
  rol: "CLIENT" | "ADMIN" | "SUPER_ADMIN";
  token: string;
}



const initialState: UserState = {
  id: 0,
  name: '',
  email: '',
  rol: null,
  token: '',
  documentNumber: '',
  documentType: '',
  lastName: '',
  phone: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.rol = action.payload.rol;
      state.token = action.payload.token;
      state.documentNumber = action.payload.documentNumber;
      state.documentType = action.payload.documentType;
      state.lastName = action.payload.lastName;
      state.phone = action.payload.phone;
    },
    logout: (state) => {
      state = null;
    },
  },
});

// Selectores
export const getUser = (state: RootState) => state.user;

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
