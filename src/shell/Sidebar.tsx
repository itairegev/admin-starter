'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import styles from './admin-shell.module.css';
import { ChevronIcon, DashboardIcon, MembersIcon, SettingsIcon } from './icons';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/admin/members', label: 'Members', icon: <MembersIcon /> },
  { href: '/admin/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Product name shown in the logo slot */
  brand: string;
}

export function Sidebar({ collapsed, onToggleCollapsed, brand }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={[styles.sidebar, collapsed ? styles.sidebarCollapsed : ''].filter(Boolean).join(' ')}>
      <div className={styles.sidebarLogo}>
        <p className={styles.logoText}>{collapsed ? brand.slice(0, 1) : brand}</p>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[styles.navItem, active ? styles.navItemActive : ''].filter(Boolean).join(' ')}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className={styles.sidebarFooter}>
        <button
          className={[styles.collapseButton, collapsed ? styles.collapseFlipped : ''].filter(Boolean).join(' ')}
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronIcon />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
