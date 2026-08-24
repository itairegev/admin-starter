'use client';

import { CreateOrganization, useOrganization } from '@clerk/nextjs';
import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  PageHeader,
  Select,
  Table,
  Tag,
  useToast,
} from '@/src/design-system/components';
import type { Column } from '@/src/design-system/components';
import styles from './members.module.css';

const MEMBERSHIP_PARAMS = {
  memberships: { pageSize: 50, keepPreviousData: true },
  invitations: { pageSize: 50, keepPreviousData: true },
} as const;

interface MemberRow {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: string;
  userId: string | null;
}

interface InvitationRow {
  id: string;
  email: string;
  role: string;
  status: string;
}

export default function MembersPage() {
  const { isLoaded, organization, memberships, invitations, membership } = useOrganization(MEMBERSHIP_PARAMS);
  const { toast } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('org:member');
  const [busy, setBusy] = useState(false);

  if (!isLoaded) {
    return (
      <div>
        <PageHeader title="Members" subtitle="Manage who has access" />
        <p>Loading…</p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div>
        <PageHeader title="Members" subtitle="Manage who has access" />
        <div className={styles.noOrg}>
          <p>Create an organization to start inviting members.</p>
          <CreateOrganization afterCreateOrganizationUrl="/admin/members" />
        </div>
      </div>
    );
  }

  const isAdmin = membership?.role === 'org:admin';

  const memberRows: MemberRow[] = (memberships?.data ?? []).map((m) => ({
    id: m.id,
    name:
      [m.publicUserData?.firstName, m.publicUserData?.lastName].filter(Boolean).join(' ') ||
      m.publicUserData?.identifier ||
      'Unknown',
    email: m.publicUserData?.identifier ?? '',
    imageUrl: m.publicUserData?.imageUrl ?? '',
    role: m.role,
    userId: m.publicUserData?.userId ?? null,
  }));

  const invitationRows: InvitationRow[] = (invitations?.data ?? []).map((inv) => ({
    id: inv.id,
    email: inv.emailAddress,
    role: inv.role,
    status: inv.status ?? 'pending',
  }));

  const changeRole = async (membershipId: string, role: string) => {
    const target = memberships?.data?.find((m) => m.id === membershipId);
    if (!target) return;
    try {
      await target.update({ role });
      toast('success', 'Role updated');
      await memberships?.revalidate?.();
    } catch {
      toast('error', 'Could not update role');
    }
  };

  const removeMember = async (membershipId: string) => {
    const target = memberships?.data?.find((m) => m.id === membershipId);
    if (!target) return;
    try {
      await target.destroy();
      toast('success', 'Member removed');
      await memberships?.revalidate?.();
    } catch {
      toast('error', 'Could not remove member');
    }
  };

  const revokeInvitation = async (invitationId: string) => {
    const target = invitations?.data?.find((inv) => inv.id === invitationId);
    if (!target) return;
    try {
      await target.revoke();
      toast('success', 'Invitation revoked');
      await invitations?.revalidate?.();
    } catch {
      toast('error', 'Could not revoke invitation');
    }
  };

  const sendInvite = async () => {
    if (!inviteEmail) return;
    setBusy(true);
    try {
      await organization.inviteMember({ emailAddress: inviteEmail, role: inviteRole });
      toast('success', `Invitation sent to ${inviteEmail}`);
      setInviteOpen(false);
      setInviteEmail('');
      await invitations?.revalidate?.();
    } catch {
      toast('error', 'Could not send invitation');
    } finally {
      setBusy(false);
    }
  };

  const memberColumns: Column<MemberRow>[] = [
    {
      key: 'member',
      title: 'Member',
      sortValue: (r) => r.name,
      render: (r) => (
        <span className={styles.memberCell}>
          <span className={styles.avatar}>
            {r.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.imageUrl} alt="" />
            ) : (
              r.name.slice(0, 2).toUpperCase()
            )}
          </span>
          <span>
            <span className={styles.memberName}>{r.name}</span>
            <br />
            <span className={styles.memberEmail}>{r.email}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      sortValue: (r) => r.role,
      render: (r) =>
        isAdmin ? (
          <span className={styles.roleSelect}>
            <Select value={r.role} onChange={(e) => changeRole(r.id, e.target.value)} aria-label="Role">
              <option value="org:admin">Admin</option>
              <option value="org:member">Member</option>
            </Select>
          </span>
        ) : (
          <Tag color={r.role === 'org:admin' ? 'lilac' : 'blue'}>{r.role.replace('org:', '')}</Tag>
        ),
    },
    {
      key: 'actions',
      title: '',
      render: (r) =>
        isAdmin ? (
          <Button size="sm" variant="ghost" onClick={() => removeMember(r.id)}>
            Remove
          </Button>
        ) : null,
    },
  ];

  const invitationColumns: Column<InvitationRow>[] = [
    { key: 'email', title: 'Email', render: (r) => r.email, sortValue: (r) => r.email },
    { key: 'role', title: 'Role', render: (r) => <Tag color="blue">{r.role.replace('org:', '')}</Tag> },
    { key: 'status', title: 'Status', render: (r) => <Tag color="orange">{r.status}</Tag> },
    {
      key: 'actions',
      title: '',
      render: (r) =>
        isAdmin ? (
          <Button size="sm" variant="ghost" onClick={() => revokeInvitation(r.id)}>
            Revoke
          </Button>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Members"
        subtitle={organization.name}
        description="Members and pending invitations for this organization. Roles come from Clerk — no application database involved."
        actions={
          isAdmin ? (
            <Button variant="primary" onClick={() => setInviteOpen(true)}>
              Invite member
            </Button>
          ) : undefined
        }
      />

      <Table columns={memberColumns} rows={memberRows} rowKey={(r) => r.id} emptyText="No members" />

      {invitationRows.length > 0 && (
        <div className={styles.sectionGap}>
          <PageHeader title="Pending invitations" />
          <Table columns={invitationColumns} rows={invitationRows} rowKey={(r) => r.id} emptyText="No pending invitations" />
        </div>
      )}

      <Modal
        open={inviteOpen}
        title="Invite member"
        onClose={() => setInviteOpen(false)}
        footer={
          <>
            <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={sendInvite} disabled={busy || !inviteEmail}>
              {busy ? 'Sending…' : 'Send invitation'}
            </Button>
          </>
        }
      >
        <div className={styles.inviteForm}>
          <Input
            label="Email address"
            type="email"
            placeholder="teammate@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Select label="Role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
            <option value="org:member">Member</option>
            <option value="org:admin">Admin</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
