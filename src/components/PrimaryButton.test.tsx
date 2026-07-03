import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders children correctly', () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Submit</PrimaryButton>);
    
    fireEvent.click(screen.getByText('Submit'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<PrimaryButton className="custom-class">Button</PrimaryButton>);
    expect(screen.getByText('Button')).toHaveClass('custom-class');
  });
});
