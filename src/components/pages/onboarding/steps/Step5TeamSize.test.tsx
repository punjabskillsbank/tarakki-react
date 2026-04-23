import { render, screen, fireEvent } from '@testing-library/react';
import { Step5TeamSize } from './Step5TeamSize';
import '@testing-library/jest-dom';

describe('Step5TeamSize', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and selects team size and company size', () => {
    render(<Step5TeamSize onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/Tell us about your team/i)).toBeInTheDocument();
    
    // Select team size
    fireEvent.click(screen.getByText('2–5'));
    // Select company size
    fireEvent.click(screen.getByText('11–50'));
    
    fireEvent.click(screen.getByText('Continue'));

    expect(updateData).toHaveBeenCalledWith({ teamSize: '2–5', companySize: '11–50' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
