'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from './admin-shell.module.css';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export interface AdminShellProps {
  /** Product name shown in the sidebar logo slot */
  brand?: string;
  title?: string;
  children: ReactNode;
}

export function AdminShell({ brand = 'Admin', title = 'Admin', children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.appLayout}>
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} brand={brand} />
      <div className={[styles.mainContent, collapsed ? styles.mainContentCollapsed : ''].filter(Boolean).join(' ')}>
        <Header title={title} />
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}
