import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import type { Member, Organization } from '../../types/admin';
import { MemberDirectory } from './MemberDirectory';

interface MembersPageProps {
  organization: Organization;
  members: Member[];
  onBack: () => void;
}

export function MembersPage({ organization, members, onBack }: MembersPageProps) {
  return (
    <section className="page-stack">
      <PageHeader
        title={`${organization.name} Members`}
        subtitle="Manage organization members"
        eyebrow={
          <button className="back-link" type="button" onClick={onBack}>
            <ArrowLeft size={17} />
            <span>Back to Organization</span>
          </button>
        }
      />

      <MemberDirectory members={members} />
    </section>
  );
}
