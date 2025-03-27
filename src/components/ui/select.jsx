import React, { useState } from 'react';

export function Select({ children, onValueChange, className = '' }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    onValueChange(e.target.value);
  };

  return (
    <select 
      value={value}
      onChange={handleChange} 
      className={`w-full p-2 border rounded-md ${className}`}
    >
      <SelectTrigger>
        <SelectValue placeholder="Choose Condition" />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </select>
  );
}

export function SelectTrigger({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return (
    <span className="text-gray-500">
      {placeholder}
    </span>
  );
}

export function SelectContent({ children }) {
  return children;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}