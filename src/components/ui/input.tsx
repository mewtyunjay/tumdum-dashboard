import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = '', type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`flex h-9 w-full rounded-md border border-border/10 bg-secondary/30 px-3 text-base text-foreground shadow-sm backdrop-blur placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-secondary/50 focus:ring-1 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${type === 'number' ? 'input-reset' : ''} ${className}`}
      {...props}
    />
  );
} 