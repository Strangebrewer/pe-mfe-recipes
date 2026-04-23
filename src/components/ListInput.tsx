import React, { useRef } from 'react';

type Props = {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
};

export default function ListInput({ items, onChange, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (!value) return;
      onChange([...items, value]);
      e.currentTarget.value = '';
    }
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="tw:flex tw:flex-col tw:gap-1">
      {items.map((item, i) => (
        <div
          key={i}
          className="tw:flex tw:items-center tw:gap-2 tw:bg-gray-100 tw:rounded tw:px-3 tw:py-1.5"
        >
          <span className="tw:flex-1 tw:text-sm tw:text-gray-800">{item}</span>
          <button
            type="button"
            onClick={() => remove(i)}
            className="tw:text-gray-400 tw:hover:text-red-500 tw:text-xs tw:leading-none"
          >
            ✕
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? 'Type and press Enter to add'}
        className="tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-1.5 tw:text-sm tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-blue-400"
      />
    </div>
  );
}
