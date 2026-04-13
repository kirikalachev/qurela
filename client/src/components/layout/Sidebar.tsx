'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  icon?: string;
}

function NavItem({ href, children, icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-all ${
        isActive
          ? 'bg-[#D0D0D0] text-navy border-r-4 border-primary-dark'
          : 'text-navy hover:bg-gray-200'
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
}

export function Sidebar() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as any)?.role;

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-52 bg-surface border-r border-gray-300 overflow-y-auto">
      <nav className="py-2">
        <NavItem href="/dashboard" icon="🏠">
          Dashboard
        </NavItem>
        <NavItem href="/notes" icon="📝">
          My Notes
        </NavItem>
        <NavItem href="/notes/new" icon="➕">
          Create Note
        </NavItem>
        
        <div className="my-3 border-t border-gray-300" />
        
        <NavItem href="/settings" icon="⚙️">
          Settings
        </NavItem>

        {role === 'ADMIN' && (
          <>
            <div className="my-3 border-t border-gray-300" />
            <div className="px-4 py-2 text-xs font-bold text-admin uppercase">
              Admin Only
            </div>
            <NavItem href="/admin" icon="🔧">
              Admin Panel
            </NavItem>
          </>
        )}
      </nav>
    </aside>
  );
}