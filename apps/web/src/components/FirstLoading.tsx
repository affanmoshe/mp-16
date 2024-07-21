import { useAppSelector } from '@/lib/hooks';
import parseJWT from '@/utils/parseJwt';
import { getCookie } from 'cookies-next';
import React, { useEffect, useLayoutEffect } from 'react';

type Props = {};

const FirstLoading = ({ children }: { children: React.ReactNode }) => {
  //   const user = useAppSelector((state) => state.auth);

  //   useEffect(() => {
  //     const token = getCookie('access-token');
  //     if (token) {
  //       const user = parseJWT(token);
  //       user.user = user;
  //       user.status = { isLogin: true };
  //     }
  //     // console.log(user.status.isLogin);
  //   }, []);

  return <>{children}</>;
};

export default FirstLoading;
