import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrandBadge } from './BrandBadge';

describe('BrandBadge', () => {
  it('renders the Tarakki logo and text', () => {
    render(<BrandBadge />);
    expect(screen.getByAltText('Tarakki Logo')).toBeInTheDocument();
    expect(screen.getByText('Tarakki')).toBeInTheDocument();
  });
});
