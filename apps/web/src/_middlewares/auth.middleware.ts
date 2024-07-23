import { Dispatch } from '@reduxjs/toolkit';
import { redirect } from 'next/navigation';
import parseJWT from '@/utils/parseJwt';
import instance from '@/utils/axiosInstance';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { loginState, logoutState } from '@/lib/features/auth/authSlice';
import { AxiosError } from 'axios';

type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
};

export const register = ({
  username,
  email,
  password,
  referrerCode,
  roleId,
}: {
  username: string;
  email: string;
  password: string;
  referrerCode: string;
  roleId: number;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      await instance().post('/auth/register', {
        username,
        email,
        password,
        referrerCode,
        roleId,
      });

      const access_token = getCookie('access-token');

      if (!access_token)
        throw new Error('Login gagal. Silakan login dari halaman login.');

      const user: User = parseJWT(access_token);
      dispatch(loginState(user));

      return true;
    } catch (error) {
      deleteCookie('access-token');
      deleteCookie('refresh-token');
      throw error;
    }
  };
};

export const login = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      await instance().post('/auth/login', {
        email,
        password,
      });

      const access_token = getCookie('access-token');

      if (!access_token) throw new Error('Login gagal. Silakan login ulang.');

      const user: User = parseJWT(access_token);
      dispatch(loginState(user));

      return true;
    } catch (error) {
      deleteCookie('access-token');
      deleteCookie('refresh-token');
      throw error;
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    try {
      deleteCookie('access-token');
      deleteCookie('refresh-token');
      dispatch(logoutState());

      return true;
    } catch (error) {
      throw error;
    }
  };
};

// export const keepLogin = () => {
//   return async (dispatch: Dispatch) => {
//     try {
//       const token = getCookie('access-token');
//       if (!token) throw new Error('Silakan login ulang.');

//       const user = parseJWT(token) as User;

//       if (user.username) {
//         dispatch(loginState(user));
//       }

//       return true;
//     } catch (error) {
//       if (error instanceof Error) {
//         deleteCookie('access-token');
//         deleteCookie('refresh-token');
//         throw error;
//       }
//     }
//   };
// };
