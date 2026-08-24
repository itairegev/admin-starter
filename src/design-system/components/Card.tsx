import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  extra?: ReactNode;
  hoverable?: boolean;
  children: ReactNode;
}

export function Card({ title, extra, hoverable = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={[styles.card, hoverable ? styles.hoverable : '', className ?? ''].filter(Boolean).join(' ')}
      {...rest}
    >
      {(title || extra) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {extra}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
