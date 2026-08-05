import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OrganizationListPage } from './OrganizationListPage';
import { adminOrganizationsFactory } from '../../../../test-utils/factories';

describe('OrganizationListPage', () => {
  it('renders the organizations heading and list summary', () => {
    const organizations = adminOrganizationsFactory();

    render(<OrganizationListPage organizations={organizations} onOpenOrganization={jest.fn()} />);

    expect(screen.getByRole('heading', { name: /organizations/i })).toBeInTheDocument();
    expect(screen.getByText(/manage all organizations/i)).toBeInTheDocument();
    expect(screen.getByText(/total organizations/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('passes the selected organization id through the open handler', () => {
    const onOpenOrganization = jest.fn();
    const organizations = adminOrganizationsFactory();

    render(<OrganizationListPage organizations={organizations} onOpenOrganization={onOpenOrganization} />);

    fireEvent.click(screen.getByLabelText(/open acme corporation/i));

    expect(onOpenOrganization).toHaveBeenCalledWith('1');
  });
});
