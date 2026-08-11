import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders children correctly', () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Submit</PrimaryButton>);
    
    await user.click(screen.getByText('Submit'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<PrimaryButton className="custom-class">Button</PrimaryButton>);
    expect(screen.getByText('Button')).toHaveClass('custom-class');
  });
});
