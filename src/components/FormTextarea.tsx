import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  showCount?: boolean;
  autoResize?: boolean;
}

export function FormTextarea({ 
  label, 
  error, 
  id, 
  className, 
  style, 
  showCount,
  autoResize,
  maxLength,
  onChange,
  ...props 
}: FormTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(() => {
    return String(props.value || props.defaultValue || '').length;
  });

  const handleResize = () => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleResize();
  }, [autoResize, props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    handleResize();
    if (onChange) {
      onChange(e);
    }
  };

  const currentLength = props.value !== undefined ? String(props.value).length : charCount;

  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium text-gray-900 mb-2">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        maxLength={maxLength}
        className={cn(
          'w-full px-3 py-3 rounded-lg border transition-all duration-200 resize-none outline-none',
          autoResize && 'overflow-hidden',
          error
            ? 'border-[#E2445C] focus:border-[#E2445C] focus:shadow-[0_0_0_2px_rgba(226,68,92,0.1)]'
            : 'border-[#D1D5DB] focus:border-[#0073EA] focus:shadow-[0_0_0_2px_rgba(0,115,234,0.1)]',
          className
        )}
        style={{ fontSize: '14px', ...style }}
        onChange={handleChange}
        {...props}
      />
      {(error || showCount) && (
        <div className="flex justify-between items-start mt-1">
          <div className="flex-1">
            {error && (
              <p className="text-[12px] text-[#E2445C]">
                {error}
              </p>
            )}
          </div>
          {showCount && (
            <span className="text-[12px] text-gray-500 ml-2 whitespace-nowrap">
              {maxLength ? `${currentLength} / ${maxLength}` : currentLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
