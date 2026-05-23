import { Avatar } from '../../components/ui/Avatar';
import type { Organization } from '../../types/admin';

interface OrganizationCardProps {
  organization: Organization;
  onOpen: (organizationId: string) => void;
}

export function OrganizationCard({ organization, onOpen }: OrganizationCardProps) {
  return (
    <article className="organization-card" onClick={() => onOpen(organization.id)}>
      <button className="organization-card__open" type="button" aria-label={`Open ${organization.name}`} />
      <div className="organization-card__summary">
        <div>
          <h3>{organization.name}</h3>
          <p>{organization.description}</p>
        </div>
        <span className="organization-card__members">{organization.memberCount} Members</span>
      </div>

      <div className="organization-card__meta">
        <div className="owner-block">
          <span className="meta-label">Owner</span>
          <div className="owner-block__person">
            <Avatar initials={organization.owner.initials} />
            <div>
              <strong>{organization.owner.name}</strong>
              <span>{organization.owner.email}</span>
            </div>
          </div>
        </div>

        <div>
          <span className="meta-label">Address</span>
          <p>{organization.address}</p>
        </div>

        <div>
          <span className="meta-label">Location</span>
          <p>{organization.location.city}</p>
          <p>{organization.location.country}</p>
        </div>
      </div>
    </article>
  );
}
