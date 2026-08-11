import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemberDirectory } from './MemberDirectory';
import { adminMembersByOrganizationFactory } from '../../../../test-utils/factories';

describe('MemberDirectory', () => {
  it('renders the members table from the provided data', () => {
    const members = adminMembersByOrganizationFactory()['1'];

    render(<MemberDirectory members={members} />);

    expect(screen.getByText(/alex doe/i)).toBeInTheDocument();
    expect(screen.getByText(/priya kumar/i)).toBeInTheDocument();
  });

  it('filters members by the search input', async () => {
    const user = userEvent.setup();
    const members = adminMembersByOrganizationFactory()['1'];

    render(<MemberDirectory members={members} />);

    await user.type(
      screen.getByRole('textbox', { name: /search members/i }),
      'priya'
    );

    expect(screen.getByText(/priya kumar/i)).toBeInTheDocument();
    expect(screen.queryByText(/alex doe/i)).not.toBeInTheDocument();
  });
});