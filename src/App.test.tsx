import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the application and shows onboarding', async () => {
    render(<App />);
    // Since it starts with an entrance transition, we wait for Step 1 or the transition
    await waitFor(() => {
      expect(screen.getByText(/Welcome to Tarakki/i) || screen.getByText(/Setting up your workspace/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
