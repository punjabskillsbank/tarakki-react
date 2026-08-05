import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MembersTable } from './MembersTable';
import { adminMembersByOrganizationFactory } from '../../../../test-utils/factories';

describe('MembersTable', () => {
  it('renders the member table headers and rows', () => {
    const members = adminMembersByOrganizationFactory()['1'];

    render(<MembersTable members={members} />);

    expect(screen.getByRole('table', { name: /organization members/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /member/i })).toBeInTheDocument();
    expect(screen.getByText(/alex doe/i)).toBeInTheDocument();
    expect(screen.getByText(/priya kumar/i)).toBeInTheDocument();
  });
});
