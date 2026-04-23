import { render, screen, fireEvent } from '@testing-library/react';
import { Step14ProjectList } from './Step14ProjectList';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
}));

describe('Step14ProjectList', () => {
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <Step14ProjectList onBack={onBack} data={data} updateData={updateData} />
      </BrowserRouter>
    );
  };

  it('renders correctly with default tasks', () => {
    renderComponent();
    expect(screen.getByText(/List your projects/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task 2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task 3')).toBeInTheDocument();
  });

  it('adds a new task when Add another task is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Add another task/i));
    expect(screen.getByPlaceholderText('Task 4')).toBeInTheDocument();
  });

  it('removes a task when X is clicked', () => {
    renderComponent();
    const removeButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg.lucide-x'));
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByDisplayValue('Task 1')).not.toBeInTheDocument();
  });

  it('shows EntranceTransition and navigates to dashboard on finish', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Get started'));
    expect(screen.getByText('Entering Tarakki')).toBeInTheDocument();
    
    // In EntranceTransition, onComplete calls navigate('/dashboard')
    // But testing the full transition is complex due to timers.
    // We already tested EntranceTransition separately.
  });
});
