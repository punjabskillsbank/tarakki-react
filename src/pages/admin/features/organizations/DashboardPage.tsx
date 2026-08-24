import { Building2, Users } from 'lucide-react';
import type { Member, Organization } from '../../../../types/admin';

interface DashboardPageProps {
  organizations: Organization[];
  membersByOrganization: Record<string, Member[]>;
}

export function DashboardPage({ organizations, membersByOrganization }: DashboardPageProps) {
  const totalMembers = Object.values(membersByOrganization).reduce(
    (total, members) => total + members.length,
    0
  );

  return (
    <section className="grid gap-7">
      <header className="flex items-start justify-between gap-6 max-[760px]:grid">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold leading-[1.2] text-[#0f172a] max-[760px]:text-[25px]">
            Dashboard
          </h1>
          <p className="mt-2 text-[15px] leading-[1.4] text-[#6b7280]">Overview of organization activity</p>
        </div>
      </header>
      <section className="grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
        <div className="grid min-h-[148px] content-center gap-2.5 rounded-lg border border-[#e7ebf2] bg-white p-6 text-[#0f7bf2] shadow-[0_1px_2px_rgba(15,23,42,0.08),0_1px_4px_rgba(15,23,42,0.04)]">
          <Building2 size={24} />
          <span className="text-sm font-bold text-[#6b7280]">Total Organizations</span>
          <strong className="text-[32px] leading-none text-[#111827]">{organizations.length}</strong>
        </div>
        <div className="grid min-h-[148px] content-center gap-2.5 rounded-lg border border-[#e7ebf2] bg-white p-6 text-[#0f7bf2] shadow-[0_1px_2px_rgba(15,23,42,0.08),0_1px_4px_rgba(15,23,42,0.04)]">
          <Users size={24} />
          <span className="text-sm font-bold text-[#6b7280]">Total Members</span>
          <strong className="text-[32px] leading-none text-[#111827]">{totalMembers}</strong>
        </div>
      
      </section>
    </section>
  );
}
