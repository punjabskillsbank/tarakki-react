import { render, screen, fireEvent } from '@testing-library/react';
import { OrganizationDecision } from './OrganizationDecision';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

// Mock motion to avoid animation-related issues in tests
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, onClick, className, style }: any) => (
      <div onClick={onClick} className={className} style={style}>{children}</div>
    ),
    h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
    p: ({ children, className }: any) => <p className={className}>{children}</p>,
    button: ({ children, onClick, className, disabled }: any) => (
      <button onClick={onClick} className={className} disabled={disabled}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('OrganizationDecision', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
    jest.spyOn(Storage.prototype, 'getItem');
  });

  it('renders the organization decision options with personalized title', () => {
    localStorage.setItem('firstName', 'John');
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    expect(screen.getByText('Choose Your Path Forward, John')).toBeInTheDocument();
    expect(screen.getByText('Join an Organization')).toBeInTheDocument();
    expect(screen.getByText('Create an Organization')).toBeInTheDocument();
    expect(screen.getByText('Continue to Dashboard')).toBeInTheDocument();
  });

  it('initially disables the continue button', () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    const continueButton = screen.getByText('Continue to Dashboard').closest('button');
    expect(continueButton).toBeDisabled();
  });

  it('enables the continue button when "Join an Organization" is selected', () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    const joinCard = screen.getByText('Join an Organization').closest('button');
    fireEvent.click(joinCard!);

    const continueButton = screen.getByText('Continue to Dashboard').closest('button');
    expect(continueButton).not.toBeDisabled();
  });

  it('enables the continue button when "Create an Organization" is selected', () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    const createCard = screen.getByText('Create an Organization').closest('button');
    fireEvent.click(createCard!);

    const continueButton = screen.getByText('Continue to Dashboard').closest('button');
    expect(continueButton).not.toBeDisabled();
  });

  it('navigates to /dashboard when continue is clicked after selection', async () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    const joinCard = screen.getByText('Join an Organization').closest('button');
    fireEvent.click(joinCard!);

    const continueButton = screen.getByText('Continue to Dashboard');
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
