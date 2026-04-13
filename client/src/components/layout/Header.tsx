'use client';

import { useSession, signOut } from 'next-auth/react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setSessionUser } from '@/lib/api';

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setSessionUser(session.user as any);
    } else if (status === 'unauthenticated') {
      setSessionUser(null);
    }
  }, [session, status]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const user = session?.user;
  const role = (user as any)?.role;

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-gradient-to-b from-surface to-[#D0D0D0] border-b border-gray-300 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-navy">Notes Portal</h1>
          {role === 'ADMIN' && (
            <Badge variant="admin">ADMIN</Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}