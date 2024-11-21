import React from 'react';

import { Meta } from '@/layouts/Meta';
import bg from '@/public/assets/images/err_page.png';
import { Main } from '@/templates/Main';

export default function Index() {
  return (
    <Main meta={<Meta title="Cửu long cố nhân" description="Trang đích không tồn tại" />}>
      <div
        className="flex h-screen w-full flex-col items-center justify-end bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg.src})` }}
      >
        <span className="mb-12 animate-bounce text-center text-[4rem] font-bold text-yellow">
          Trang đích không tồn tại
        </span>
      </div>
    </Main>
  );
}
