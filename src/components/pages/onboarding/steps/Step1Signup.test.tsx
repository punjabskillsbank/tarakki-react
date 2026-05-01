import { render, screen, fireEvent } from '@testing-library/react';
import { Step1Signup } from './Step1Signup';
import '@testing-library/jest-dom';

describe('Step1Signup', () => {
  const onNext = jest.fn();
  const setEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Step1Signup onNext={onNext} setEmail={setEmail} />);
    expect(screen.getByText('Welcome to Tarakki')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
  });

  it('validates email and calls onNext and updateData on success', () => {
    render(<Step1Signup onNext={onNext} setEmail={setEmail} />);
    const input = screen.getByPlaceholderText('name@company.com');
    const button = screen.getByRole('button', { name: /^continue$/i });

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    expect(setEmail).toHaveBeenCalledWith('test@example.com');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('shows error for invalid email', () => {
    render(<Step1Signup onNext={onNext} setEmail={setEmail} />);
    const input = screen.getByPlaceholderText('name@company.com');
    const button = screen.getByRole('button', { name: /^continue$/i });

    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.click(button);

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });
});
