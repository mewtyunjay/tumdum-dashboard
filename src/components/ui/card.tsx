import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div className={`rounded-xl border border-border/10 bg-card/30 text-card-foreground shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/30 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: CardProps) {
  return (
    <div className={`flex flex-col space-y-1 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children }: CardProps) {
  return (
    <h3 className={`text-lg font-medium tracking-tight text-foreground/90 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children }: CardProps) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
} 