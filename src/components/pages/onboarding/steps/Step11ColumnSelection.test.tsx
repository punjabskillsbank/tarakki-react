import { render, screen, fireEvent } from '@testing-library/react';
import { Step11ColumnSelection } from './Step11ColumnSelection';
import '@testing-library/jest-dom';

describe('Step11ColumnSelection', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and selects columns', () => {
    render(<Step11ColumnSelection onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/select the relevant columns for your board/i)).toBeInTheDocument();
    
    // Select an additional column
    fireEvent.click(screen.getByText('Priority'));
    fireEvent.click(screen.getByText('Continue'));

    expect(updateData).toHaveBeenCalledWith({ 
      columns: ['Owner', 'Status', 'Due date', 'Priority'] 
    });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
