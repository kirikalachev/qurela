import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'admin';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-surface text-navy border border-gray-400',
    success: 'bg-success text-white border border-green-700',
    danger: 'bg-danger text-white border border-red-700',
    warning: 'bg-accent text-white border border-orange-700',
    admin: 'bg-admin text-white border border-orange-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}