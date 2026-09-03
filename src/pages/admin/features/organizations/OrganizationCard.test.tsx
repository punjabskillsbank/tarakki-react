import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { OrganizationCard } from './OrganizationCard';
import { adminOrganizationFactory } from '../../../../test-utils/factories';

describe('OrganizationCard', () => {
  it('renders organization summary details', () => {
    const organization = adminOrganizationFactory();

    render(<OrganizationCard organization={organization} onOpen={jest.fn()} />);

    expect(screen.getByText(organization.name)).toBeInTheDocument();
    expect(screen.getByText(organization.description)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${organization.memberCount}\\s*members`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(organization.owner.name)).toBeInTheDocument();
  });

  it('invokes the open callback when clicked', async () => {
    const onOpen = jest.fn();
    const organization = adminOrganizationFactory();

    render(<OrganizationCard organization={organization} onOpen={onOpen} />);

    await userEvent.click(screen.getByRole('button', { name: new RegExp(`open ${organization.name}`, 'i') }));

    expect(onOpen).toHaveBeenCalledWith(organization.id);
  });
});
