import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Sidebar } from './Sidebar';
import { sidebarPropsFactory } from '../test-utils/factories';

describe('Sidebar', () => {
  it('renders the navigation items and marks the active route', () => {
    const props = sidebarPropsFactory({ activeItem: 'dashboard' });

    render(<Sidebar {...props} />);

    const dashboardButton = screen.getByRole('button', {
      name: /dashboard/i,
    });
    const organizationButton = screen.getByRole('button', {
      name: /organizations/i,
    });

    expect(
      screen.getByRole('complementary', {
        name: /primary navigation/i,
      })
    ).toBeInTheDocument();

    expect(dashboardButton).toBeInTheDocument();
    expect(organizationButton).toBeInTheDocument();

    expect(dashboardButton).toHaveAttribute('aria-current', 'page');
  });

  it('invokes the navigation callback with the clicked menu item', async () => {
    const onNavigate = jest.fn();
    const props = sidebarPropsFactory({ onNavigate });
    const user = userEvent.setup();

    render(<Sidebar {...props} />);

    await user.click(
      screen.getByRole('button', {
        name: /organizations/i,
      })
    );

    expect(onNavigate).toHaveBeenCalledWith('organizations');
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});