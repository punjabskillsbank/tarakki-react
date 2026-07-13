import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingFlow } from './OnboardingFlow';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import config from '../../config/indexConfig';
import { MOCK_PASSWORD, MOCK_EMAIL, EMAIL_VAL_TEST_ID, PASSWORD_VAL_TEST_ID, STEP1_TEST_ID, STEP2_TEST_ID, STEP3_TEST_ID } from '../../test-utils/factories';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the steps to keep the flow test focused on navigation and state propagation
jest.mock('./steps/Step1Signup', () => ({
  Step1Signup: ({ onNext, setEmail, setPassword }: any) => (
    <div data-testid={STEP1_TEST_ID}>
      Step 1 
      <button onClick={() => {
        setEmail(MOCK_EMAIL);
        setPassword(MOCK_PASSWORD);
        onNext();
      }}>Next</button>
    </div>
  ),
}));

jest.mock('./steps/Step2ProfileInfo', () => ({
  Step2ProfileInfo: ({ onNext, onBack, email, password }: any) => (
    <div data-testid={STEP2_TEST_ID}>
      Step 2 
      <span data-testid={EMAIL_VAL_TEST_ID}>{email}</span>
      <span data-testid={PASSWORD_VAL_TEST_ID}>{password}</span>
      <button onClick={onNext}>Next</button> 
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

jest.mock('./EntranceTransition', () => ({
  EntranceTransition: ({ onComplete }: any) => (
    <div data-testid={STEP3_TEST_ID}>
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
    expect(screen.getByTestId(STEP1_TEST_ID)).toBeInTheDocument();
  });

  it('navigates to Step 2 when Next is clicked in Step 1 and propagates state', async () => {
    render(
      <MemoryRouter>
        <OnboardingFlow />
      </MemoryRouter>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('Next'));
    expect(await screen.findByTestId(STEP2_TEST_ID)).toBeInTheDocument();
    expect(screen.getByTestId(EMAIL_VAL_TEST_ID)).toHaveTextContent(MOCK_EMAIL);
    expect(screen.getByTestId(PASSWORD_VAL_TEST_ID)).toHaveTextContent(MOCK_PASSWORD);
  });

  it('navigates back to Step 1 when Back is clicked in Step 2', async () => {
    render(
      <MemoryRouter>
        <OnboardingFlow />
      </MemoryRouter>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('Next')); // To Step 2
    const backButton = await screen.findByText('Back');
    await user.click(backButton); // Back to Step 1
    expect(await screen.findByTestId(STEP1_TEST_ID)).toBeInTheDocument();
  });

  it('navigates to /organization-decision after step 3 completes', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <OnboardingFlow />
      </MemoryRouter>
    );
    
    const user = userEvent.setup();

    // Step 1 -> Step 2
    await user.click(screen.getByText('Next'));
    
    // Wait for Step 2 to mount
    const step2Container = await screen.findByTestId(STEP2_TEST_ID);
    
    // Step 2 -> Step 3
    await user.click(within(step2Container).getByText('Next'));
    
    // Step 3 -> Complete
    const completeButton = await screen.findByText('Complete');
    await user.click(completeButton);

    expect(mockNavigate).toHaveBeenCalledWith(config.routes.organizationDecision);
  });
});
