import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OrganizationDetailPage } from './OrganizationDetailPage';
import { adminOrganizationFactory } from '../../../../test-utils/factories';

describe('OrganizationDetailPage', () => {
  it('renders organization details and triggers the member navigation callback', () => {
    const organization = adminOrganizationFactory();
    const onBack = jest.fn();
    const onViewMembers = jest.fn();

    render(<OrganizationDetailPage organization={organization} onBack={onBack} onViewMembers={onViewMembers} />);

    expect(screen.getByText(/acme corporation/i)).toBeInTheDocument();
    expect(screen.getByText(/leading enterprise software solutions provider/i)).toBeInTheDocument();
    expect(screen.getByText(/view members/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /view members/i }));

    expect(onViewMembers).toHaveBeenCalledTimes(1);
  });

  it('invokes the back callback', () => {
    const organization = adminOrganizationFactory();
    const onBack = jest.fn();

    render(<OrganizationDetailPage organization={organization} onBack={onBack} onViewMembers={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /back to organizations/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
