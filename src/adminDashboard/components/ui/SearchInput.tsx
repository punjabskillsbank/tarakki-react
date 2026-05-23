import { Search } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface SearchInputProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, placeholder, onChange }: SearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="search-input">
      <Search aria-hidden="true" size={18} />
      <input value={value} placeholder={placeholder} onChange={handleChange} />
    </label>
  );
}
