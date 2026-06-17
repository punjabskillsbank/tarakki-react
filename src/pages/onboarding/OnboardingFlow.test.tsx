import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingFlow } from './OnboardingFlow';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import config from '../../config/indexConfig';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

jest.mock('./EntranceTransition', () => ({
  EntranceTransition: ({ onComplete }: any) => (
    <div data-testid="step-3">
      Step 3 <button onClick={onComplete}>Complete</button>
    </div>
  ),
}));

describe('OnboardingFlow', () => {
  it('renders Step 1 initially', () => {
    render(
      <MemoryRouter>
        <OnboardingFlow />
      </MemoryRouter>
    );
    expect(screen.getByTestId('step-1')).toBeInTheDocument();
  });

  it('navigates to Step 2 when Next is clicked in Step 1', async () => {
    render(
      <MemoryRouter>
        <OnboardingFlow />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Next'));
    expect(await screen.findByTestId('step-2')).toBeInTheDocument();
  });

  it('navigates back to Step 1 when Back is clicked in Step 2', async () => {
    render(
      <MemoryRouter>
        <OnboardingFlow />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Next')); // To Step 2
    const backButton = await screen.findByText('Back');
    fireEvent.click(backButton); // Back to Step 1
    expect(await screen.findByTestId('step-1')).toBeInTheDocument();
  });

  it('navigates to /organization-decision after step 3 completes', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <OnboardingFlow />
      </MemoryRouter>
    );
    
    // Step 1 -> Step 2
    fireEvent.click(screen.getByText('Next'));
    
    // Step 2 -> Step 3
    fireEvent.click(await screen.findByText('Next'));
    
    // Step 3 -> Complete
    const completeButton = await screen.findByText('Complete');
    fireEvent.click(completeButton);

    expect(mockNavigate).toHaveBeenCalledWith(config.routes.organizationDecision);
  });
});
