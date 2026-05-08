import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';
import '@testing-library/jest-dom';

// Mock motion/react
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    h1: ({ children, className, ...props }: any) => <h1 className={className} {...props}>{children}</h1>,
    p: ({ children, className, ...props }: any) => <p className={className} {...props}>{children}</p>,
  },
}));

describe('PageHeader', () => {
  const mockProps = {
    title: 'Welcome to Tarakki',
    subtitle: 'Build your workspace',
  };

  it('renders title and subtitle', () => {
    render(<PageHeader {...mockProps} />);
    expect(screen.getByText('Welcome to Tarakki')).toBeInTheDocument();
    expect(screen.getByText('Build your workspace')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<PageHeader {...mockProps} />);
    const logo = screen.getByAltText('Tarakki Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/tarakki_logo_fav.png');
  });
});
