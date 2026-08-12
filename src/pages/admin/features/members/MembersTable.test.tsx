import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MembersTable } from './MembersTable';
import { adminMembersByOrganizationFactory } from '../../../../test-utils/factories';

describe('MembersTable', () => {
  it('renders a semantic members table with headers, rows, and action buttons', () => {
    const members = adminMembersByOrganizationFactory()['1'];
    const [firstMember, secondMember] = members;

    render(<MembersTable members={members} />);

    expect(screen.getByRole('table', { name: /organization members/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /^member$/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByText(firstMember.name)).toBeInTheDocument();
    expect(screen.getByText(secondMember.name)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(`view ${firstMember.name}`, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(`edit ${firstMember.name}`, 'i') })).toBeInTheDocument();
  });
});
