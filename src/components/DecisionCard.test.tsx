import { render, screen, fireEvent } from '@testing-library/react';
import { DecisionCard } from './DecisionCard';
import { Users } from 'lucide-react';
import '@testing-library/jest-dom';

// Mock motion/react
jest.mock('motion/react', () => ({
  motion: {
    button: ({ children, onClick, className }: any) => (
      <button onClick={onClick} className={className}>{children}</button>
    ),
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  },
}));

describe('DecisionCard', () => {
  const mockProps = {
    title: 'Test Title',
    description: 'Test Description',
    icon: Users,
    isSelected: false,
    onClick: jest.fn(),
  };

  it('renders title and description', () => {
    render(<DecisionCard {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<DecisionCard {...mockProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('renders checkmark when selected', () => {
    const { rerender } = render(<DecisionCard {...mockProps} />);
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();

    rerender(<DecisionCard {...mockProps} isSelected={true} />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });
});
