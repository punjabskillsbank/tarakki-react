import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingFlow } from './OnboardingFlow';
import '@testing-library/jest-dom';

// Mock the steps to keep the flow test focused on navigation
jest.mock('./steps/Step1Signup', () => ({
  Step1Signup: ({ onNext }: any) => (
    <div data-testid="step-1">
      Step 1 <button onClick={onNext}>Next</button>
    </div>
  ),
}));

jest.mock('./steps/Step2ProfileInfo', () => ({
  Step2ProfileInfo: ({ onNext, onBack }: any) => (
    <div data-testid="step-2">
      Step 2 <button onClick={onNext}>Next</button> <button onClick={onBack}>Back</button>
    </div>
  ),
}));

describe('OnboardingFlow', () => {
  it('renders Step 1 initially', () => {
    render(<OnboardingFlow />);
    expect(screen.getByTestId('step-1')).toBeInTheDocument();
  });

  it('navigates to Step 2 when Next is clicked in Step 1', async () => {
    render(<OnboardingFlow />);
    fireEvent.click(screen.getByText('Next'));
    expect(await screen.findByTestId('step-2')).toBeInTheDocument();
  });

  it('navigates back to Step 1 when Back is clicked in Step 2', async () => {
    render(<OnboardingFlow />);
    fireEvent.click(screen.getByText('Next')); // To Step 2
    const backButton = await screen.findByText('Back');
    fireEvent.click(backButton); // Back to Step 1
    expect(await screen.findByTestId('step-1')).toBeInTheDocument();
  });
});
