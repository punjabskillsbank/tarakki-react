import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MembersTable } from './MembersTable';
import { adminMembersByOrganizationFactory } from '../../../../test-utils/factories';

describe('MembersTable', () => {
  it('renders a semantic members table with headers, rows, and action buttons', () => {
    const members = adminMembersByOrganizationFactory()['1'];

    render(<MembersTable members={members} />);

    expect(screen.getByRole('table', { name: /organization members/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /^member$/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /alex doe/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /priya kumar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view alex doe/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit alex doe/i })).toBeInTheDocument();
  });
});
