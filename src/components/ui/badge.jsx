import React from 'react';

export function Badge({ 
  children, 
  variant = 'default', 
  className = '',
  onClick
}) {
  const variantStyles = {
    default: 'bg-blue-500 text-white',
    outline: 'bg-white text-blue-500 border border-blue-500'
  };

  return (
    <span
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full text-sm 
        ${variantStyles[variant]} 
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {children}
    </span>
  );
}