import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Topbar } from './Topbar';
import { topbarPropsFactory } from '../test-utils/factories';

describe('Topbar', () => {
  it('renders the brand area and admin profile marker', () => {
    const props = topbarPropsFactory();

    render(<Topbar {...props} />);

    expect(screen.getByRole('img', { name: /tarakki/i })).toBeInTheDocument();
    expect(screen.getByText(/tarakki admin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/admin profile/i)).toHaveTextContent('AD');
  });
});
