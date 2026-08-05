import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardPage } from './DashboardPage';
import { adminOrganizationsFactory, adminMembersByOrganizationFactory } from '../../../../test-utils/factories';

describe('DashboardPage', () => {
  it('renders total organization and member summaries', () => {
    const organizations = adminOrganizationsFactory();
    const membersByOrganization = adminMembersByOrganizationFactory();

    render(<DashboardPage organizations={organizations} membersByOrganization={membersByOrganization} />);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/overview of organization activity/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('36')).toBeInTheDocument();
  });
});
