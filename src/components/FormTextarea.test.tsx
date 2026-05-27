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
    expect(screen.getByText('Textarea is invalid')).toBeInTheDocument();
  });

  it('passes other props to the textarea element', () => {
    render(<FormTextarea id="test-textarea" label="Test Textarea" placeholder="Write something..." rows={5} />);
    const textarea = screen.getByPlaceholderText('Write something...');
    expect(textarea).toHaveAttribute('rows', '5');
  });
});
