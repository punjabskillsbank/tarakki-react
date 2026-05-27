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
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('passes other props to the input element', () => {
    render(<FormInput id="test-input" label="Test Label" placeholder="Enter text here" disabled />);
    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toBeDisabled();
  });
});
