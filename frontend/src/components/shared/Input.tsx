import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "disabled:bg-gray-50 disabled:text-gray-500",
            error && "border-red-300 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {helpText && !error && <p className="text-sm text-gray-500">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
