import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminDashboard } from './AdminDashboard';
import { adminOrganizationsFactory, adminMembersByOrganizationFactory } from '../../test-utils/factories';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useState: jest.fn(),
  };
});

jest.mock('./hooks/useAdminData', () => ({
  useAdminData: jest.fn(),
}));

import { useAdminData } from './hooks/useAdminData';

const mockUseState = jest.mocked(React.useState);

describe('AdminDashboard', () => {
  beforeEach(() => {
    mockUseState.mockImplementation((...args: any[]) => [args[0], jest.fn()]);

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

  it('shows a no organization selected message when the selected organization id is stale or invalid', () => {
    mockUseState
      .mockImplementationOnce(() => ['organizations', jest.fn()])
      .mockImplementationOnce(() => ['detail', jest.fn()])
      .mockImplementationOnce(() => ['stale-organization-id', jest.fn()]);

    (useAdminData as jest.Mock).mockReturnValue({
      organizations: adminOrganizationsFactory(),
      membersByOrganization: adminMembersByOrganizationFactory(),
      isLoading: false,
      error: null,
    });

    render(<AdminDashboard />);

    expect(screen.getByText(/no organization selected/i)).toBeInTheDocument();
  });
});
