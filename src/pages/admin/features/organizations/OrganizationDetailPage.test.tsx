import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { OrganizationDetailPage } from './OrganizationDetailPage';
import { adminOrganizationFactory } from '../../../../test-utils/factories';

describe('OrganizationDetailPage', () => {
  it('renders organization details', () => {
    const organization = adminOrganizationFactory();

    render(<OrganizationDetailPage organization={organization} onBack={jest.fn()} onViewMembers={jest.fn()} />);

    expect(screen.getByText(/acme corporation/i)).toBeInTheDocument();
    expect(screen.getByText(/leading enterprise software solutions provider/i)).toBeInTheDocument();
    expect(screen.getByText(/view members/i)).toBeInTheDocument();
  });

  it('triggers the member navigation callback when the view members button is clicked', async () => {
    const user = userEvent.setup();
    const organization = adminOrganizationFactory();
    const onViewMembers = jest.fn();

    render(<OrganizationDetailPage organization={organization} onBack={jest.fn()} onViewMembers={onViewMembers} />);

    await user.click(screen.getByRole('button', { name: /view members/i }));

    expect(onViewMembers).toHaveBeenCalledTimes(1);
  });

  it('invokes the back callback', async () => {
    const user = userEvent.setup();
    const organization = adminOrganizationFactory();
    const onBack = jest.fn();

    render(<OrganizationDetailPage organization={organization} onBack={onBack} onViewMembers={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /back to organizations/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
