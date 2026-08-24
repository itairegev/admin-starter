'use client';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import styles from './admin-shell.module.css';
import { DirectionIcon, MoonIcon, SunIcon } from './icons';

export interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  // Read initial values set on <html> (persisted by the toggles below)
  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = window.localStorage.getItem('admin-theme');
    const storedDir = window.localStorage.getItem('admin-dir');
    if (storedTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      setTheme('dark');
    }
    if (storedDir === 'rtl') {
      root.setAttribute('dir', 'rtl');
      setDir('rtl');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem('admin-theme', next);
    setTheme(next);
  }, [theme]);

  const toggleDir = useCallback(() => {
    const next = dir === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', next);
    window.localStorage.setItem('admin-dir', next);
    setDir(next);
  }, [dir]);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h2 className={styles.headerTitle}>{title}</h2>
      </div>
      <div className={styles.headerRight}>
        <button className={styles.iconButton} onClick={toggleDir} aria-label="Toggle text direction" title="Toggle LTR/RTL">
          <DirectionIcon />
        </button>
        <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle theme" title="Toggle light/dark">
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <OrganizationSwitcher hidePersonal afterSelectOrganizationUrl="/admin" />
        <UserButton />
      </div>
    </header>
  );
}
