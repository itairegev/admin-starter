import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Tag.module.css';

export type TagColor = 'blue' | 'teal' | 'green' | 'lilac' | 'orange' | 'pink';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: TagColor;
  outlined?: boolean;
  children: ReactNode;
}

export function Tag({ color = 'blue', outlined = false, className, children, ...rest }: TagProps) {
  return (
    <span
      className={[styles.tag, styles[color], outlined ? styles.outlined : '', className ?? ''].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </span>
  );
}
