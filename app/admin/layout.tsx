import { ToastProvider } from '@/src/design-system/components';
import { AdminShell } from '@/src/shell/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminShell brand="Starter" title="Admin">
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
