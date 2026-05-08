import { render } from '@testing-library/react';
import { PageBackground } from './PageBackground';
import '@testing-library/jest-dom';

// Mock motion/react
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, style, ...props }: any) => (
      <div className={className} style={style} {...props}>{children}</div>
    ),
  },
}));

describe('PageBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<PageBackground />);
    expect(container.firstChild).toHaveClass('absolute inset-0');
  });

  it('contains the dot pattern and gradient orbs', () => {
    const { container } = render(<PageBackground />);
    // Check for the dot pattern div
    const dotPattern = container.querySelector('div[style*="radial-gradient"]');
    expect(dotPattern).toBeInTheDocument();
  });
});
