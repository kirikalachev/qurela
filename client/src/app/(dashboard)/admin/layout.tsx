'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === 'authenticated' && role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, role, router]);

  if (status === 'loading' || role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-admin text-white px-4 py-2 rounded font-bold">
        ⚠ ADMIN CONTROL PANEL
      </div>
      {children}
    </div>
  );
}