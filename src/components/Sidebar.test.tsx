import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from './Sidebar';
import { sidebarPropsFactory } from '../test-utils/factories';

describe('Sidebar', () => {
  it('renders the navigation items and marks the active route', () => {
    const props = sidebarPropsFactory({ activeItem: 'dashboard' });

    render(<Sidebar {...props} />);

    const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
    const organizationButton = screen.getByRole('button', { name: /organizations/i });

    expect(screen.getByRole('complementary', { name: /primary navigation/i })).toBeInTheDocument();
    expect(dashboardButton).toBeInTheDocument();
    expect(organizationButton).toBeInTheDocument();
    expect(dashboardButton).toHaveClass('text-[#0f7bf2]');
    expect(dashboardButton).toHaveClass('bg-[#e9f2ff]');
  });

  it('invokes the navigation callback with the clicked menu item', () => {
    const onNavigate = jest.fn();
    const props = sidebarPropsFactory({ onNavigate });

    render(<Sidebar {...props} />);

    fireEvent.click(screen.getByRole('button', { name: /organizations/i }));

    expect(onNavigate).toHaveBeenCalledWith('organizations');
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
