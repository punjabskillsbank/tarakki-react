import { render, screen, fireEvent } from '@testing-library/react';
import { Step12DashboardSetup } from './Step12DashboardSetup';
import '@testing-library/jest-dom';

describe('Step12DashboardSetup', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  it('renders and continues', () => {
    render(<Step12DashboardSetup onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/Get real-time insights with dashboards/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Continue'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
