import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateBoard } from './CreateBoard';
import BoardService from '../../services/BoardService';
import toast from 'react-hot-toast';
import { boardPayloadFactory } from '../../test-utils/factories';

jest.mock('../../services/BoardService');
jest.mock('react-hot-toast');

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({
    orgId: "2",
  }),
}));

describe('CreateBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    const defaultPayload = boardPayloadFactory();

    localStorage.setItem('memberId', defaultPayload.createdBy);
  });

  it('renders the form correctly', () => {
    render(<CreateBoard />);
    expect(screen.getByText('Create Board', { selector: 'h1' })).toBeInTheDocument();
    const boardNameInput = screen.getByLabelText('Board Name');
    expect(boardNameInput).toBeInTheDocument();
    expect(boardNameInput).toHaveAttribute('maxLength', '100');
    expect(screen.getByText('0 / 100')).toBeInTheDocument();
    
    const boardDescInput = screen.getByLabelText('Board Description');
    expect(boardDescInput).toBeInTheDocument();
    expect(boardDescInput).toHaveAttribute('maxLength', '500');
    expect(screen.getByText('0 / 500')).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: 'Create Board' })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    const user = userEvent.setup();
    render(<CreateBoard />);
    
    const submitBtn = screen.getByRole('button', { name: 'Create Board' });
    await user.click(submitBtn);

    expect(await screen.findByText('Board name is required')).toBeInTheDocument();
    expect(await screen.findByText('Board description is required')).toBeInTheDocument();
    expect(BoardService.createBoard).not.toHaveBeenCalled();
  });

  it('calls BoardService and shows success toast on valid submission', async () => {
    const user = userEvent.setup();
    (BoardService.createBoard as jest.Mock).mockResolvedValueOnce(boardPayloadFactory());
    
    render(<CreateBoard />);
    
    await user.type(screen.getByLabelText('Board Name'), 'New Board');
    await user.type(screen.getByLabelText('Board Description'), 'Description here');
    
    await user.click(screen.getByRole('button', { name: 'Create Board' }));

    await waitFor(() => {
      expect(BoardService.createBoard).toHaveBeenCalledWith(boardPayloadFactory());
      expect(toast.success).toHaveBeenCalledWith('Board created successfully!');
    });
  });

  it('shows error toast on API failure', async () => {
    const user = userEvent.setup();
    (BoardService.createBoard as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    render(<CreateBoard />);
    
    await user.type(screen.getByLabelText('Board Name'), 'New Board');
    await user.type(screen.getByLabelText('Board Description'), 'Description here');
    
    await user.click(screen.getByRole('button', { name: 'Create Board' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Board couldn't be created. Please try again.");
    });
  });
});
