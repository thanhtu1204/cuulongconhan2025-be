import { Card } from 'flowbite-react';
import type { ReactNode } from 'react';
import React from 'react';

interface InfoCardProps {
  title: string;
  value: string;
  children: ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, children }) => {
  return (
    <Card>
      <div className="flex items-center">
        {children}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default InfoCard;
