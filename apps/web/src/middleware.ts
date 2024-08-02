import { NextRequest, NextResponse } from 'next/server';
import { AxiosError } from 'axios';
// import jwt, { Jwt } from 'jsonwebtoken';
import instance from './utils/axiosInstance';
import parseJWT from './utils/parseJwt';

type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
};

const expiryChecker = async (token: string) => {
  if (!token) return true;

  const decoded = await decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  return Date.now() >= decoded.exp * 1000 - 500000;
};

const decodeToken = async (token: string) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64').toString());
  } catch (error) {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const REFRESH_TOKEN = request.cookies.get('refresh-token')?.value || '';
  const ACCESS_TOKEN = request.cookies.get('access-token')?.value || '';
  const response = NextResponse.next();

  let role = '';

  if ((!REFRESH_TOKEN && ACCESS_TOKEN) || (REFRESH_TOKEN && !ACCESS_TOKEN)) {
    response.cookies.delete('access-token');
    response.cookies.delete('refresh-token');
  }

  // check if access token is expired
  // Refresh ACCESS_TOKEN if REFRESH_TOKEN & ACCESS_TOKEN  is available but ACCESS_TOKEN is expired
  if (REFRESH_TOKEN) {
    const isTokenExpired = await expiryChecker(ACCESS_TOKEN);

    if (isTokenExpired) {
      try {
        const { data } = await instance().get('/auth/refresh-token', {
          headers: {
            Authorization: `Bearer ${REFRESH_TOKEN}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        response.cookies.set('access-token', data.result.accessToken);
      } catch (error) {
        if (error instanceof AxiosError)
          console.log('error di refresh', error.response?.data);

        response.cookies.delete('access-token');
        response.cookies.delete('refresh-token');
      }
    }
  }

  // fetch user profile if newAccessToken is available
  const newAccessToken =
    response.cookies.get('access-token')?.value || ACCESS_TOKEN;

  if (newAccessToken) {
    try {
      const { data } = await instance().get('/users/profile', {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      role = data.data.role;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('error di axios', error.response?.data);
      }

      response.cookies.delete('access-token');
      response.cookies.delete('refresh-token');
    }
  }

  const url = request.nextUrl.pathname;

  // Redirect based on user role and URL
  if (role) {
    if (
      url.startsWith('/login') ||
      url.startsWith('/register') ||
      url.startsWith('/lupa-password') ||
      url.startsWith('/reset-password')
    ) {
      const redirect = request.nextUrl.searchParams.get('redirect') || '/';

      return NextResponse.redirect(new URL(redirect, request.url));
    }

    if (url.startsWith('/dashboard') && role !== 'ORGANIZER') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (
      url.startsWith('/discovery') ||
      (url.startsWith('/events') && role !== 'CUSTOMER')
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    if (
      url.startsWith('/dashboard') ||
      url.startsWith('/transaction') ||
      url.startsWith('/verifikasi')
    ) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', url);

      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

// export const config = {
//   matcher: [
//     '/login',
//     '/register',
//     '/dashboard/:path*',
//     '/transaction/:path*',
//     '/event/:path*',
//   ],
// };
