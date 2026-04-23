import { render, screen, fireEvent } from '@testing-library/react';
import { Step8HowDidYouHear } from './Step8HowDidYouHear';
import '@testing-library/jest-dom';

describe('Step8HowDidYouHear', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and selects source', () => {
    render(<Step8HowDidYouHear onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/how did you hear about us\?/i)).toBeInTheDocument();
    
    // Use an option that actually exists in the component
    fireEvent.click(screen.getByText('YouTube'));
    fireEvent.click(screen.getByText('Continue'));

    expect(updateData).toHaveBeenCalledWith({ howDidYouHear: ['YouTube'] });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
