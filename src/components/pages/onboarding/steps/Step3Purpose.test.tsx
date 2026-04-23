import { render, screen, fireEvent } from '@testing-library/react';
import { Step3Purpose } from './Step3Purpose';
import '@testing-library/jest-dom';

describe('Step3Purpose', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = { firstName: 'John' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with user name', () => {
    render(<Step3Purpose onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText('Hi John, what brings you here today?')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('selects a purpose and calls onNext', () => {
    render(<Step3Purpose onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    const personalButton = screen.getByText('Personal');
    
    fireEvent.click(personalButton);
    fireEvent.click(screen.getByText('Continue'));

    expect(updateData).toHaveBeenCalledWith({ purpose: 'Personal' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
