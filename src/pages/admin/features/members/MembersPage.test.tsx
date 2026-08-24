import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('calls onBack when the back button is clicked', async () => {
    const user = userEvent.setup();
    const organization = adminOrganizationFactory();
    const members = adminMembersByOrganizationFactory()['1'];
    const onBack = jest.fn();

    render(<MembersPage organization={organization} members={members} onBack={onBack} />);

    await user.click(screen.getByRole('button', { name: /back to organization/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
