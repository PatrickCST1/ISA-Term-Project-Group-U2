import React from 'react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'lowest' | 'glass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-surface-container-lowest shadow-[0_20px_40px_rgba(0,61,155,0.04)]',
      lowest: 'bg-surface-container-lowest border border-outline-variant/20',
      glass: 'glass-effect shadow-[0_20px_40px_rgba(0,61,155,0.06)]',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl p-6 transition-all duration-300', variants[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
