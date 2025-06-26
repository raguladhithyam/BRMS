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
        "bg-white rounded-lg shadow-sm border border-gray-200",
        padding && "p-6",
        hover && "hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};