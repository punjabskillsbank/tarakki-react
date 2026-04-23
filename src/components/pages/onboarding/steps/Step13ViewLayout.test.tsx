import { render, screen, fireEvent } from '@testing-library/react';
import { Step13ViewLayout } from './Step13ViewLayout';
import '@testing-library/jest-dom';

describe('Step13ViewLayout', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and selects layout', () => {
    render(<Step13ViewLayout onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/Add a view layout/i)).toBeInTheDocument();
    
    // Select Kanban
    fireEvent.click(screen.getByText('Kanban'));
    fireEvent.click(screen.getByText('Continue'));

    expect(updateData).toHaveBeenCalledWith({ viewLayout: 'kanban' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
