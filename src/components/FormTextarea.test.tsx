import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { FormTextarea } from './FormTextarea';

describe('FormTextarea', () => {
  it('renders the label and textarea', () => {
    render(<FormTextarea id="test-textarea" label="Test Textarea" />);
    expect(screen.getByLabelText('Test Textarea')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<FormTextarea id="test-textarea" label="Test Textarea" error="Textarea is invalid" />);
    const errorMessage = screen.getByText('Textarea is invalid');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.tagName.toLowerCase()).toBe('p');
    expect(errorMessage).toHaveClass('text-[12px] text-[#E2445C]');
  });

  it('passes other props to the textarea element', () => {
    render(<FormTextarea id="test-textarea" label="Test Textarea" placeholder="Write something..." rows={5} />);
    const textarea = screen.getByPlaceholderText('Write something...');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('merges custom className with default classes', () => {
    render(<FormTextarea id="test-textarea" label="Test Textarea" className="custom-test-class" />);
    const textarea = screen.getByLabelText('Test Textarea');
    expect(textarea).toHaveClass('custom-test-class');
    expect(textarea).toHaveClass('w-full');
  });

  it('displays character count when showCount is true', () => {
    render(<FormTextarea id="test-textarea" label="Test Textarea" showCount maxLength={100} defaultValue="hello" />);
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
  });

  it('displays only current character count when maxLength is not provided', () => {
    render(<FormTextarea id="test-textarea" label="Test Textarea" showCount defaultValue="hello" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
