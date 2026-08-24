'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  key: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
}

export function Tabs({ items, defaultActiveKey }: TabsProps) {
  const [active, setActive] = useState(defaultActiveKey ?? items[0]?.key);
  const activeItem = items.find((item) => item.key === active);

  return (
    <div>
      <div className={styles.tabList} role="tablist">
        {items.map((item) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={item.key === active}
            className={[styles.tab, item.key === active ? styles.tabActive : ''].filter(Boolean).join(' ')}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">
        {activeItem?.content}
      </div>
    </div>
  );
}
