'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Table.module.css';

export interface Column<T> {
  key: string;
  title: ReactNode;
  render: (row: T) => ReactNode;
  /** Provide to make the column sortable */
  sortValue?: (row: T) => string | number;
}

export interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyText?: string;
}

type SortState = { key: string; dir: 'asc' | 'desc' } | null;

export function Table<T>({ columns, rows, rowKey, emptyText = 'No data' }: TableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const getValue = col.sortValue;
    return [...rows].sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sort, columns]);

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => {
              const sortable = Boolean(col.sortValue);
              const active = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  className={[sortable ? styles.sortable : '', active ? styles.sortActive : ''].filter(Boolean).join(' ')}
                  onClick={sortable ? () => toggleSort(col.key) : undefined}
                  aria-sort={active ? (sort?.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.title}
                  {sortable && (
                    <span className={styles.sortIcon} aria-hidden>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        {active && sort?.dir === 'desc' ? (
                          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <path d="M2 6.5L5 3.5L8 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className={styles.empty}>
                  <span className={styles.emptyIcon} aria-hidden>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="6" y="10" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
                      <path d="M6 17H34" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                  {emptyText}
                </div>
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
