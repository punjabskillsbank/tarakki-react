import { render, screen, fireEvent } from '@testing-library/react';
import { Step4Role } from './Step4Role';
import '@testing-library/jest-dom';

describe('Step4Role', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Step4Role onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/What best describes your current role\?/i)).toBeInTheDocument();
    expect(screen.getByText('Business owner')).toBeInTheDocument();
  });

  it('selects a role and calls onNext', () => {
    render(<Step4Role onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    fireEvent.click(screen.getByText('Team leader'));
    fireEvent.click(screen.getByText('Continue'));

    expect(updateData).toHaveBeenCalledWith({ role: 'Team leader' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    render(<Step4Role onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    fireEvent.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
