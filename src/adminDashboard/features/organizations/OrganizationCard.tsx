import type { Organization } from '../../types/admin';

interface OrganizationCardProps {
  organization: Organization;
  onOpen: (organizationId: string) => void;
}

export function OrganizationCard({ organization, onOpen }: OrganizationCardProps) {
  return (
    <article
      className="relative grid min-h-[136px] gap-6 rounded-lg border border-[#e7ebf2] bg-[#fbfcfe] px-6 py-[22px] hover:border-[#c9dcfb] hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)] max-[760px]:min-h-0 max-[760px]:p-[18px]"
      onClick={() => onOpen(organization.id)}
    >
      <button className="absolute inset-0 border-0 opacity-0" type="button" aria-label={`Open ${organization.name}`} />
      <div className="grid grid-cols-[1fr_auto] items-start gap-8 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
        <div className="max-[1100px]:col-span-full max-[760px]:col-auto">
          <h3 className="m-0 text-base font-extrabold leading-tight text-[#263142]">{organization.name}</h3>
          <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">{organization.description}</p>
        </div>
        <span className="justify-self-end whitespace-nowrap text-xs font-extrabold text-[#697386] max-[1100px]:justify-self-start">
          {organization.memberCount} Members
        </span>
      </div>

      <div className="grid grid-cols-[minmax(280px,1.2fr)_minmax(220px,1fr)_minmax(220px,1fr)] items-start gap-8 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
        <div className="grid gap-2.5">
          <span className="text-sm font-bold text-[#6b7280]">Owner</span>
          <div className="grid grid-cols-[auto_1fr] items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0f7bf2] text-xs font-extrabold text-white">
              {organization.owner.initials}
            </span>
            <div>
              <strong className="block text-sm leading-tight text-[#263142]">{organization.owner.name}</strong>
              <span className="mt-1 block text-[13px] leading-tight text-[#697386]">{organization.owner.email}</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-sm font-bold text-[#6b7280]">Address</span>
          <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">{organization.address}</p>
        </div>

        <div>
          <span className="text-sm font-bold text-[#6b7280]">Location</span>
          <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">{organization.location.city}</p>
          <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">{organization.location.state}</p>
          <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">{organization.location.country}</p>
          <p className="mt-1.5 text-[13px] leading-[1.35] text-[#4b5563]">{organization.location.postalCode}</p>
        </div>
      </div>
    </article>
  );
}
