import { render, screen, fireEvent } from '@testing-library/react';
import { PillButton } from './PillButton';
import '@testing-library/jest-dom';

describe('PillButton', () => {
  it('renders children correctly', () => {
    render(<PillButton>Test Label</PillButton>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<PillButton onClick={handleClick}>Click Me</PillButton>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when selected prop is true', () => {
    render(<PillButton selected={true}>Selected</PillButton>);
    const button = screen.getByText('Selected');
    expect(button).toHaveClass('border-[#0073EA]');
    expect(button).toHaveClass('bg-[#E6F0FF]');
  });

  it('applies default styles when selected prop is false', () => {
    render(<PillButton selected={false}>Not Selected</PillButton>);
    const button = screen.getByText('Not Selected');
    expect(button).toHaveClass('border-[#D1D5DB]');
    expect(button).toHaveClass('bg-white');
  });
});
