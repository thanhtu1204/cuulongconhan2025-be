'use client';

import 'aos/dist/aos.css';

import AOS from 'aos';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

type IMainProps = {
  meta?: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  // const router = useRouter();
  //
  // if (isMobile) {
  //   router.push('/mobile-warning');
  // }

  useEffect(() => {
    AOS.init({ disable: 'mobile' });
  }, []);

  return (
    <div className="h-full w-full">
      {props.meta}
      <main>{props.children}</main>
    </div>
  );
};

export { Main };
