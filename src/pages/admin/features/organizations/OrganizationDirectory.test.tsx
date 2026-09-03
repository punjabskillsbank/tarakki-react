import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { OrganizationDirectory } from './OrganizationDirectory';
import { adminOrganizationsFactory, adminOrganizationFactory } from '../../../../test-utils/factories';

describe('OrganizationDirectory', () => {
  it('renders organization cards from the provided data', () => {
    const organizations = adminOrganizationsFactory();
    const [firstOrganization, secondOrganization] = organizations;

    render(<OrganizationDirectory organizations={organizations} onOpenOrganization={jest.fn()} />);

    expect(screen.getByText(firstOrganization.name)).toBeInTheDocument();
    expect(screen.getByText(secondOrganization.name)).toBeInTheDocument();
  });

  it('filters organizations by the search term', async () => {
    const user = userEvent.setup();
    const organizations = adminOrganizationsFactory();
    const secondOrganization = organizations[1];

    render(<OrganizationDirectory organizations={organizations} onOpenOrganization={jest.fn()} />);

    await user.clear(screen.getByPlaceholderText(/search organizations/i));
    await user.type(screen.getByPlaceholderText(/search organizations/i), secondOrganization.name.split(' ')[0].toLowerCase());

    expect(screen.getByText(secondOrganization.name)).toBeInTheDocument();
    expect(screen.queryByText(organizations[0].name)).not.toBeInTheDocument();
  });

  it('sorts organizations by member count when selected', async () => {
    const user = userEvent.setup();
    const low = adminOrganizationFactory({ id: '1', name: 'A Org', memberCount: 1, addedAt: '2024-01-01' });
    const high = adminOrganizationFactory({ id: '2', name: 'B Org', memberCount: 5, addedAt: '2024-02-01' });

    render(<OrganizationDirectory organizations={[low, high]} onOpenOrganization={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /filter/i }));
    await user.click(screen.getByRole('button', { name: /members/i }));

    const buttons = screen.getAllByRole('button', { name: /^Open / });
    expect(buttons[0]).toHaveAttribute('aria-label', `Open ${high.name}`);
  });

  it('sorts organizations by date added when selected', async () => {
    const user = userEvent.setup();
    const older = adminOrganizationFactory({ id: '1', name: 'Old Org', memberCount: 2, addedAt: '2024-01-01' });
    const newer = adminOrganizationFactory({ id: '2', name: 'New Org', memberCount: 3, addedAt: '2024-03-01' });

    render(<OrganizationDirectory organizations={[older, newer]} onOpenOrganization={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /filter/i }));
    await user.click(screen.getByRole('button', { name: /date added/i }));

    const buttons = screen.getAllByRole('button', { name: /^Open / });
    expect(buttons[0]).toHaveAttribute('aria-label', `Open ${newer.name}`);
  });
});
