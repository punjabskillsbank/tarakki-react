import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OrganizationDirectory } from './OrganizationDirectory';
import { adminOrganizationsFactory } from '../../../../test-utils/factories';

describe('OrganizationDirectory', () => {
  it('renders organization cards from the provided data', () => {
    const organizations = adminOrganizationsFactory();

    render(<OrganizationDirectory organizations={organizations} onOpenOrganization={jest.fn()} />);

    expect(screen.getByText(/acme corporation/i)).toBeInTheDocument();
    expect(screen.getByText(/tech innovations ltd/i)).toBeInTheDocument();
  });

  it('filters organizations by the search term', () => {
    const organizations = adminOrganizationsFactory();

    render(<OrganizationDirectory organizations={organizations} onOpenOrganization={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/search organizations/i), { target: { value: 'tech' } });

    expect(screen.getByText(/tech innovations ltd/i)).toBeInTheDocument();
    expect(screen.queryByText(/acme corporation/i)).not.toBeInTheDocument();
  });
});
