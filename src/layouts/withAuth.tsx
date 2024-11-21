import { useRouter } from 'next/router';
import type { ComponentType, FC } from 'react';
import { useEffect } from 'react';

import { useAppSelector } from '@/stores';

const withAuth = (WrappedComponent: ComponentType<any>) => {
  const AuthComponent: FC = (props) => {
    const user = useAppSelector((state) => state.authen);
    const router = useRouter();

    useEffect(() => {
      if (!user.accessToken || user.user.roles !== 'USER') {
        router.replace(`/login?callbackUrl=${router.pathname}`);
      }
    }, [user.accessToken, user.user.roles, router]);

    if (!user.accessToken || user.user.roles !== 'USER') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
