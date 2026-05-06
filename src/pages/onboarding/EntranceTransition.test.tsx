import { render, screen, act } from '@testing-library/react';
import { EntranceTransition } from './EntranceTransition';
import '@testing-library/jest-dom';

describe('EntranceTransition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    render(<EntranceTransition onComplete={() => {}} />);
    expect(screen.getByText('Entering Tarakki')).toBeInTheDocument();
    expect(screen.getByText('Preparing your workspace and boards...')).toBeInTheDocument();
  });

  it('progresses to 100% and calls onComplete', () => {
    const handleComplete = jest.fn();
    render(<EntranceTransition onComplete={handleComplete} />);

    // Fast-forward until progress >= 100
    // Progress increases by 1.5 every 20ms.
    // 100 / 1.5 = 66.6 steps. 67 * 20 = 1340ms.
    act(() => {
      jest.advanceTimersByTime(1400);
    });

    expect(screen.getByText('100%')).toBeInTheDocument();

    // It waits 800ms after reaching 100%
    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
