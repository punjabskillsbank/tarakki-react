import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { FormInput } from './FormInput';

describe('FormInput', () => {
  it('renders the label and input', () => {
    render(<FormInput id="test-input" label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<FormInput id="test-input" label="Test Label" error="This field is required" />);
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.tagName.toLowerCase()).toBe('p');
    expect(errorMessage).toHaveClass('text-[12px] text-[#E2445C]');
  });

  it('passes other props to the input element', () => {
    render(<FormInput id="test-input" label="Test Label" placeholder="Enter text here" disabled />);
    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toBeDisabled();
  });

  it('merges custom className with default classes', () => {
    render(<FormInput id="test-input" label="Test Label" className="custom-test-class" />);
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('custom-test-class');
    expect(input).toHaveClass('w-full');
  });

  it('displays character count when showCount is true', () => {
    render(<FormInput id="test-input" label="Test Input" showCount maxLength={100} defaultValue="hello" />);
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
  });

  it('displays only current character count when maxLength is not provided', () => {
    render(<FormInput id="test-input" label="Test Input" showCount defaultValue="hello" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
