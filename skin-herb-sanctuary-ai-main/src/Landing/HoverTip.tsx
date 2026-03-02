import React from 'react';

interface HoverTipProps {
  children: React.ReactNode;
  tip: string;
}

const HoverTip: React.FC<HoverTipProps> = ({ children, tip }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {tip}
      </div>
    </div>
  );
};

export default HoverTip; 