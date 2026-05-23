import { ArrowLeft, Users } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import type { Organization } from '../../types/admin';

interface OrganizationDetailPageProps {
  organization: Organization;
  onBack: () => void;
  onViewMembers: () => void;
}

export function OrganizationDetailPage({ organization, onBack, onViewMembers }: OrganizationDetailPageProps) {
  return (
    <section className="organization-detail-page page-stack">
      <button className="back-link" type="button" onClick={onBack}>
        <ArrowLeft size={17} />
        <span>Back to Organizations</span>
      </button>

      <article className="organization-profile-card">
        <header className="organization-profile-card__header">
          <div>
            <h1>{organization.name}</h1>
            <p>{organization.description}</p>
          </div>
          <Button variant="primary" icon={<Users size={18} />} onClick={onViewMembers}>
            View Members
          </Button>
        </header>

        <div className="detail-grid">
          <div className="detail-tile">
            <span className="meta-label">Owner</span>
            <div className="owner-block__person">
              <Avatar initials={organization.owner.initials} />
              <div>
                <strong>{organization.owner.name}</strong>
                <span>{organization.owner.email}</span>
              </div>
            </div>
          </div>

          <div className="detail-tile">
            <span className="meta-label">Total Members</span>
            <strong className="tile-value">{organization.memberCount}</strong>
          </div>

          <div className="detail-tile">
            <span className="meta-label">Added At</span>
            <p>{organization.addedAt}</p>
          </div>

          <div className="detail-tile">
            <span className="meta-label">Address</span>
            <p>{organization.address}</p>
          </div>

          <div className="detail-tile">
            <span className="meta-label">Location</span>
            <p>{organization.location.city}</p>
            <p>
              {organization.location.country}
              {organization.location.postalCode ? ` - ${organization.location.postalCode}` : ''}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
