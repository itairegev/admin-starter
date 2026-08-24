'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  Tabs,
  Tag,
  useToast,
} from '@/src/design-system/components';
import styles from './settings.module.css';

export default function SettingsPage() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');

  const generalTab = (
    <div className={styles.stack}>
      <Card title="Workspace">
        <div className={styles.formGrid}>
          <Input
            label="Workspace name"
            placeholder="My workspace"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={name.length > 30 ? 'Keep it under 30 characters' : undefined}
            hint="Shown in the sidebar and emails"
          />
          <Select label="Default language" defaultValue="en">
            <option value="en">English</option>
            <option value="he">עברית</option>
            <option value="es">Español</option>
          </Select>
          <Select label="Timezone" defaultValue="utc">
            <option value="utc">UTC</option>
            <option value="local">Browser local time</option>
          </Select>
        </div>
        <div className={styles.formActions}>
          <Button variant="primary" onClick={() => toast('success', 'Settings saved')}>
            Save changes
          </Button>
          <Button onClick={() => toast('info', 'Nothing changed')}>Cancel</Button>
          <Button variant="danger" onClick={() => setModalOpen(true)}>
            Delete workspace
          </Button>
        </div>
      </Card>

      <Card title="Tag palette" extra={<Tag color="green">6 colors</Tag>}>
        <div className={styles.tagRow}>
          <Tag color="blue">Blue</Tag>
          <Tag color="teal">Teal</Tag>
          <Tag color="green">Green</Tag>
          <Tag color="lilac">Lilac</Tag>
          <Tag color="orange">Orange</Tag>
          <Tag color="pink">Pink</Tag>
          <Tag color="blue" outlined>Outlined</Tag>
        </div>
      </Card>
    </div>
  );

  const notificationsTab = (
    <Card title="Notifications">
      <div className={styles.formGrid}>
        <Select label="Email digest" defaultValue="daily">
          <option value="off">Off</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </Select>
        <Select label="Alert level" defaultValue="errors">
          <option value="all">Everything</option>
          <option value="errors">Errors only</option>
        </Select>
      </div>
      <Button variant="primary" onClick={() => toast('success', 'Notification preferences saved')}>
        Save
      </Button>
    </Card>
  );

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your workspace" />

      <Tabs
        items={[
          { key: 'general', label: 'General', content: generalTab },
          { key: 'notifications', label: 'Notifications', content: notificationsTab },
        ]}
      />

      <Modal
        open={modalOpen}
        title="Delete workspace?"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                setModalOpen(false);
                toast('error', 'This is a demo — nothing was deleted');
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        This action cannot be undone. All conversations, settings, and member access will be permanently removed.
      </Modal>
    </div>
  );
}
