import type { Organization } from '../../types/admin';
import { OrganizationDirectory } from './OrganizationDirectory';

interface OrganizationListPageProps {
  organizations: Organization[];
  onOpenOrganization: (organizationId: string) => void;
}

export function OrganizationListPage({ organizations, onOpenOrganization }: OrganizationListPageProps) {
  return (
    <section className="grid gap-7">
      <header className="flex items-start justify-between gap-6 max-[760px]:grid">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold leading-[1.2] text-[#0f172a] max-[760px]:text-[25px]">
            Organizations
          </h1>
          <p className="mt-2 text-[15px] leading-[1.4] text-[#6b7280]">Manage all organizations</p>
        </div>
      </header>
rrrrr
      <section className="grid grid-cols-[minmax(280px,744px)] max-[760px]:grid-cols-1" aria-label="Organization summary">
        <div className="grid h-28 content-center rounded-lg border border-[#e7ebf2] bg-white px-7 shadow-[0_1px_2px_rgba(15,23,42,0.08),0_1px_4px_rgba(15,23,42,0.04)]">
          <span className="text-sm font-bold text-[#6b7280]">Total Organizations</span>
          <strong className="mt-2.5 text-3xl leading-none text-[#111827]">{organizations.length}</strong>
        </div>
      </section>

      <OrganizationDirectory organizations={organizations} onOpenOrganization={onOpenOrganization} />
    </section>
  );
}
