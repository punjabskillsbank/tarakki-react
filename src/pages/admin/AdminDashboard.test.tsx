import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminDashboard } from './AdminDashboard';
import { adminOrganizationsFactory, adminMembersByOrganizationFactory } from '../../test-utils/factories';

jest.mock('./hooks/useAdminData', () => ({
  useAdminData: jest.fn(),
}));

import { useAdminData } from './hooks/useAdminData';

describe('AdminDashboard', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', {
      value: jest.fn(),
      writable: true,
    });
  });

  it('renders the dashboard shell and dashboard content when the dashboard item is active', () => {
    (useAdminData as jest.Mock).mockReturnValue({
      organizations: adminOrganizationsFactory(),
      membersByOrganization: adminMembersByOrganizationFactory(),
      isLoading: false,
      error: null,
    });

    render(<AdminDashboard />);

    expect(screen.getByLabelText(/primary navigation/i)).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/overview of organization activity/i)).toBeInTheDocument();
  });

  it('shows the loading state while admin data is being fetched', () => {
    (useAdminData as jest.Mock).mockReturnValue({
      organizations: [],
      membersByOrganization: {},
      isLoading: true,
      error: null,
    });

    render(<AdminDashboard />);

    expect(screen.getByText(/loading admin data/i)).toBeInTheDocument();
  });

  it('shows the error state when admin data loading fails', () => {
    (useAdminData as jest.Mock).mockReturnValue({
      organizations: [],
      membersByOrganization: {},
      isLoading: false,
      error: 'Unable to load admin data.',
    });

    render(<AdminDashboard />);

    expect(screen.getByText(/unable to load admin data/i)).toBeInTheDocument();
  });
});
