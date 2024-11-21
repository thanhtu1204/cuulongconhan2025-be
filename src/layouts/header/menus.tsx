'use client';

import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

import menuData from '@/utils/data/menuData';

const Menus = () => {
  const controls = useAnimation();
  const path = usePathname();
  useEffect(() => {
    controls.start('visible');
  }, [controls]);
  return (
    <ul className="flex h-full flex-row items-center justify-center">
      {menuData.map((menu: any) => (
        <motion.li
          initial={{ opacity: 0, x: '-100%' }}
          animate={controls}
          transition={{ duration: 0.5 }}
          variants={{
            visible: { opacity: 1, x: 0 }
          }}
          key={menu.id}
          className="mr-10"
        >
          <Link
            className={`text-center text-2xl font-bold text-yellow hover:text-blueRay ${
              path === menu.link ? 'border-b-2 border-b-yellow' : ''
            }`}
            href={menu.link}
          >
            {menu.title}
          </Link>
        </motion.li>
      ))}
    </ul>
  );
};

export default Menus;
