import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppShell } from './AppShell';
import { appShellPropsFactory } from '../test-utils/factories';

describe('AppShell', () => {
  it('renders the topbar, sidebar, and children content', () => {
    const props = appShellPropsFactory({
      children: <div>Dashboard content</div>,
    });

    render(<AppShell {...props} />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: /primary navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
  });

  it('forwards navigation selection changes to the callback', () => {
    const onNavigate = jest.fn();
    const props = appShellPropsFactory({
      onNavigate,
      children: <div>Organization content</div>,
    });

    render(<AppShell {...props} />);

    fireEvent.click(screen.getByRole('button', { name: /organizations/i }));

    expect(onNavigate).toHaveBeenCalledWith('organizations');
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
