import React from 'react';

export function Checkbox({ 
  checked, 
  onCheckedChange, 
  id, 
  className = '' 
}) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={() => onCheckedChange(!checked)}
      className={`h-4 w-4 rounded text-blue-600 focus:ring-blue-500 ${className}`}
    />
  );
}