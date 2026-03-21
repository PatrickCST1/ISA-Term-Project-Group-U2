import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'primary-gradient text-white shadow-[0_10px_20px_rgba(0,61,155,0.15)] hover:shadow-[0_15px_25px_rgba(0,61,155,0.2)] active:scale-[0.98]',
      secondary: 'bg-secondary-container text-on-secondary-container hover:bg-surface-container-high active:scale-[0.98]',
      tertiary: 'bg-transparent text-primary hover:bg-surface-container-low active:scale-[0.98]',
      danger: 'bg-red-600 text-white shadow-[0_10px_20px_rgba(211,47,47,0.15)] hover:bg-red-700 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs font-bold',
      md: 'px-6 py-3 text-sm font-bold',
      lg: 'px-8 py-4 text-base font-bold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all duration-300 font-headline tracking-wide disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
