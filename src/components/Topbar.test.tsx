import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Topbar } from './Topbar';
import { topbarPropsFactory, MOCK_TOKEN, MOCK_MEMBER_ID } from '../test-utils/factories';

describe('Topbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the brand area and admin profile marker', () => {
    const props = topbarPropsFactory();

    render(<Topbar {...props} />);

    expect(screen.getByRole('img', { name: /tarakki/i })).toBeInTheDocument();
    expect(screen.getByText(/tarakki admin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/admin profile/i)).toHaveTextContent('AD');
  });

  it('renders a logout control', () => {
    render(<Topbar {...topbarPropsFactory()} />);

    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });

  it('clears stored auth when logout is clicked', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', MOCK_TOKEN);
    localStorage.setItem('memberId', MOCK_MEMBER_ID);

    render(<Topbar {...topbarPropsFactory()} />);
    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('memberId')).toBeNull();
  });
});
