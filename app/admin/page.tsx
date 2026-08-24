'use client';

import { PageHeader, Table, Tag, Button } from '@/src/design-system/components';
import type { Column, TagColor } from '@/src/design-system/components';
import styles from './dashboard.module.css';

interface AccountRow {
  id: string;
  name: string;
  plan: string;
  planColor: TagColor;
  members: number;
  conversations: number;
  status: 'active' | 'trial' | 'churned';
}

const MOCK_ACCOUNTS: AccountRow[] = [
  { id: '1', name: 'Acme Fitness', plan: 'Pro', planColor: 'blue', members: 412, conversations: 1284, status: 'active' },
  { id: '2', name: 'Northwind Yoga', plan: 'Starter', planColor: 'teal', members: 86, conversations: 233, status: 'active' },
  { id: '3', name: 'Globex Wellness', plan: 'Pro', planColor: 'blue', members: 251, conversations: 890, status: 'trial' },
  { id: '4', name: 'Initech Pilates', plan: 'Enterprise', planColor: 'lilac', members: 1093, conversations: 4102, status: 'active' },
  { id: '5', name: 'Umbrella Spa', plan: 'Starter', planColor: 'teal', members: 34, conversations: 51, status: 'churned' },
];

const STATUS_COLOR: Record<AccountRow['status'], TagColor> = {
  active: 'green',
  trial: 'orange',
  churned: 'pink',
};

const COLUMNS: Column<AccountRow>[] = [
  { key: 'name', title: 'Account', render: (r) => <strong>{r.name}</strong>, sortValue: (r) => r.name },
  { key: 'plan', title: 'Plan', render: (r) => <Tag color={r.planColor}>{r.plan}</Tag>, sortValue: (r) => r.plan },
  { key: 'members', title: 'Members', render: (r) => r.members.toLocaleString(), sortValue: (r) => r.members },
  {
    key: 'conversations',
    title: 'Conversations',
    render: (r) => r.conversations.toLocaleString(),
    sortValue: (r) => r.conversations,
  },
  { key: 'status', title: 'Status', render: (r) => <Tag color={STATUS_COLOR[r.status]}>{r.status}</Tag>, sortValue: (r) => r.status },
];

const STATS = [
  { label: 'Active accounts', value: '128', trend: '+12%', up: true },
  { label: 'Total conversations', value: '6,560', trend: '+8%', up: true },
  { label: 'Messages today', value: '1,904', trend: '-3%', up: false },
  { label: 'Avg response time', value: '42s', trend: '-11%', up: true },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your workspace"
        actions={<Button variant="primary">New account</Button>}
      />

      <div className={styles.statGrid}>
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Accounts</h2>
      <Table columns={COLUMNS} rows={MOCK_ACCOUNTS} rowKey={(r) => r.id} emptyText="No accounts yet" />
    </div>
  );
}

function StatCard({ label, value, trend, up }: { label: string; value: string; trend: string; up: boolean }) {
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      <span className={[styles.statTrend, up ? styles.trendUp : styles.trendDown].join(' ')}>{trend} vs last week</span>
    </div>
  );
}
