import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
// import { IUsers } from '@/interface/user.interface';
import parseJWT from '@/utils/parseJwt';
import instance from '@/utils/axiosInstance';
import { getCookie } from 'cookies-next';
import { RootState } from '@/lib/store';

type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
};

type Status = {
  isLogin: boolean;
};

interface Auth {
  user: User;
  status: Status;
}

const initialState: Auth = {
  user: {
    id: 0,
    username: '',
    email: '',
    role: '',
    isVerified: false,
    avatar: '',
  },
  status: {
    isLogin: false,
  },
};

const token = getCookie('access-token');
if (token) {
  const user = parseJWT(token);
  initialState.user = user;
  initialState.status.isLogin = true;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginState: (state: Auth, action: PayloadAction<User>) => {
      const user = action.payload;
      state.user = user;
      state.status.isLogin = true;
    },
    logoutState: (state: Auth) => {
      state.user = initialState.user;
      state.status = initialState.status;
    },
  },
});

export const { loginState, logoutState } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth;

export default authSlice.reducer;
