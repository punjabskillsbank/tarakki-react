import { ArrowLeft, Users } from 'lucide-react';
import type { Organization } from '../../types/admin';

interface OrganizationDetailPageProps {
  organization: Organization;
  onBack: () => void;
  onViewMembers: () => void;
}

export function OrganizationDetailPage({ organization, onBack, onViewMembers }: OrganizationDetailPageProps) {
  return (
    <section className="grid gap-[18px]">
      <button
        className="inline-flex min-h-[22px] items-center gap-2 justify-self-start border-0 bg-transparent p-0 text-sm font-extrabold text-[#2f8afa]"
        type="button"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        <span>Back to Organizations</span>
      </button>

      <article className="rounded-lg border border-[#e7ebf2] bg-white px-7 pb-8 pt-7 shadow-[0_1px_2px_rgba(15,23,42,0.08),0_1px_4px_rgba(15,23,42,0.04)] max-[760px]:p-4">
        <header className="mb-7 flex items-start justify-between gap-6">
          <div>
            <h1 className="m-0 text-[26px] font-extrabold leading-[1.15] text-[#0f172a]">{organization.name}</h1>
            <p className="mt-2 text-sm leading-[1.4] text-[#6b7280]">{organization.description}</p>
          </div>
          <button
            className="inline-flex h-[42px] min-w-[152px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#0f7bf2] bg-[#0f7bf2] px-3.5 text-sm font-extrabold leading-none text-white shadow-[0_1px_2px_rgba(15,123,242,0.28)] hover:-translate-y-px"
            type="button"
            onClick={onViewMembers}
          >
            <Users size={18} />
            <span>View Members</span>
          </button>
        </header>

        <div className="grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
          <div className="grid min-h-[98px] content-center rounded-lg bg-[#fbfcfe] p-[18px]">
            <span className="text-sm font-bold text-[#6b7280]">Owner</span>
            <div className="grid grid-cols-[auto_1fr] items-center gap-2.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#0f7bf2] text-sm font-extrabold text-white">
                {organization.owner.initials}
              </span>
              <div>
                <strong className="block text-sm leading-tight text-[#263142]">{organization.owner.name}</strong>
                <span className="mt-1 block text-[13px] leading-tight text-[#697386]">{organization.owner.email}</span>
              </div>
            </div>
          </div>

          <div className="grid min-h-[98px] content-center rounded-lg bg-[#fbfcfe] p-[18px]">
            <span className="text-sm font-bold text-[#6b7280]">Total Members</span>
            <strong className="mt-2.5 text-2xl leading-none text-[#111827]">{organization.memberCount}</strong>
          </div>

          <div className="grid min-h-[98px] content-center rounded-lg bg-[#fbfcfe] p-[18px]">
            <span className="text-sm font-bold text-[#6b7280]">Added At</span>
            <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">{organization.addedAt}</p>
          </div>

          <div className="grid min-h-[98px] content-center rounded-lg bg-[#fbfcfe] p-[18px]">
            <span className="text-sm font-bold text-[#6b7280]">Address</span>
            <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">{organization.address}</p>
          </div>

          <div className="grid min-h-[98px] content-center rounded-lg bg-[#fbfcfe] p-[18px]">
            <span className="text-sm font-bold text-[#6b7280]">Location</span>
            <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">{organization.location.city}</p>
            <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">
              {organization.location.country}
              {organization.location.postalCode ? ` - ${organization.location.postalCode}` : ''}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
