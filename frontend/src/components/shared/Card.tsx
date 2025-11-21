import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  padding = true,
  hover = false
}) => {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50",
        padding && "p-6",
        hover && "hover:shadow-lg hover:border-gray-300/50 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
};