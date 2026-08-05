import { ArrowLeft } from 'lucide-react';
import type { Member, Organization } from '../../../../types/admin';
import { MemberDirectory } from './MemberDirectory';

interface MembersPageProps {
  organization: Organization;
  members: Member[];
  onBack: () => void;
}

export function MembersPage({ organization, members, onBack }: MembersPageProps) {
  return (
    <section className="grid gap-7">
      <header className="flex items-start justify-between gap-6 max-[760px]:grid">
        <div>
          <button
            className="mb-5 inline-flex min-h-[22px] items-center gap-2 border-0 bg-transparent p-0 text-sm font-extrabold text-[#2f8afa]"
            type="button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            <span>Back to Organization</span>
          </button>
          <h1 className="m-0 text-[28px] font-extrabold leading-[1.2] text-[#0f172a] max-[760px]:text-[25px]">
            {organization.name} Members
          </h1>
          <p className="mt-2 text-[15px] leading-[1.4] text-[#6b7280]">Manage organization members</p>
        </div>
      </header>

      <MemberDirectory members={members} />
    </section>
  );
}
