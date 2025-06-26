import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helpText, options, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={cn(
            "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "disabled:bg-gray-50 disabled:text-gray-500",
            error && "border-red-300 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {helpText && !error && <p className="text-sm text-gray-500">{helpText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;