import { render, screen, fireEvent } from '@testing-library/react';
import { Step10CreateBoard } from './Step10CreateBoard';
import '@testing-library/jest-dom';

describe('Step10CreateBoard', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and updates board name', () => {
    render(<Step10CreateBoard onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/Let's start working together/i)).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText(/e.g., My first project/i);
    fireEvent.change(input, { target: { value: 'My New Board' } });
    fireEvent.click(screen.getByText('Continue'));

    expect(updateData).toHaveBeenCalledWith({ boardName: 'My New Board' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
