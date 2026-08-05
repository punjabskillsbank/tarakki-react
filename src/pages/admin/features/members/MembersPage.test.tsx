import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MembersPage } from './MembersPage';
import { adminOrganizationFactory, adminMembersByOrganizationFactory } from '../../../../test-utils/factories';

describe('MembersPage', () => {
  it('renders the organization members page heading and directory content', () => {
    const organization = adminOrganizationFactory();
    const members = adminMembersByOrganizationFactory()['1'];

    render(<MembersPage organization={organization} members={members} onBack={jest.fn()} />);

    expect(screen.getByText(/acme corporation members/i)).toBeInTheDocument();
    expect(screen.getByText(/manage organization members/i)).toBeInTheDocument();
    expect(screen.getByText(/alex doe/i)).toBeInTheDocument();
  });
});
