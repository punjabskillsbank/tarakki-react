import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemberDirectory } from './MemberDirectory';
import { adminMembersByOrganizationFactory, adminMemberFactory } from '../../../../test-utils/factories';

describe('MemberDirectory', () => {
  it('renders the members table from the provided data', () => {
    const members = adminMembersByOrganizationFactory()['1'];
    const [firstMember, secondMember] = members;

    render(<MemberDirectory members={members} />);

    expect(screen.getByText(firstMember.name)).toBeInTheDocument();
    expect(screen.getByText(secondMember.name)).toBeInTheDocument();
  });

  it('filters members by the search input', async () => {
    const user = userEvent.setup();
    const members = adminMembersByOrganizationFactory()['1'];
    const [firstMember, secondMember] = members;

    render(<MemberDirectory members={members} />);

    await user.type(
      screen.getByRole('textbox', { name: /search members/i }),
      secondMember.name.split(' ')[0].toLowerCase()
    );

    expect(screen.getByText(secondMember.name)).toBeInTheDocument();
    expect(screen.queryByText(firstMember.name)).not.toBeInTheDocument();
  });

  it('sorts members by joined date when selected', async () => {
    const user = userEvent.setup();
    const older = adminMemberFactory({ id: 'm1', name: 'Old Member', joinedAt: '2024-01-01' });
    const newer = adminMemberFactory({ id: 'm2', name: 'New Member', joinedAt: '2024-03-01' });

    render(<MemberDirectory members={[older, newer]} />);

    await user.click(screen.getByRole('button', { name: /filter/i }));
    await user.click(screen.getByRole('button', { name: /joined/i }));

    const names = screen.getAllByRole('row').slice(1).map((row) => row.textContent || '');
    expect(names[0]).toContain(newer.name);
  });

  it('sorts members alphabetically when selected', async () => {
    const user = userEvent.setup();
    const zed = adminMemberFactory({ id: 'm1', name: 'Zed Alpha' });
    const abby = adminMemberFactory({ id: 'm2', name: 'Abby Beta' });

    render(<MemberDirectory members={[zed, abby]} />);

    await user.click(screen.getByRole('button', { name: /filter/i }));
    await user.click(screen.getByRole('button', { name: /name/i }));

    const names = screen.getAllByRole('row').slice(1).map((row) => row.textContent || '');
    expect(names[0]).toContain(abby.name);
  });
});