'use client';

import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            Notes Portal
          </h1>
          <p className="text-primary-light text-sm mt-1">
            Access your digital notes archive
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}