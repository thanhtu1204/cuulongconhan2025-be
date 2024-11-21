import Image from 'next/image';
import React from 'react';

import coNhan from '@/public/assets/images/cuulongcn.jpg';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
      <Image src={coNhan} alt="loader" className="h-full w-full" />
    </div>
  );
};

export default Loading;
