import { render, screen, fireEvent } from '@testing-library/react';
import { Step7FocusArea } from './Step7FocusArea';
import '@testing-library/jest-dom';

describe('Step7FocusArea', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and selects focus area', () => {
    render(<Step7FocusArea onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/Select what you'd like to focus on first/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Project management'));
    fireEvent.click(screen.getByText('Continue'));

    expect(updateData).toHaveBeenCalledWith({ focusArea: 'Project management' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
