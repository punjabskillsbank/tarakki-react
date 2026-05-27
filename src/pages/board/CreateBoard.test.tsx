import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateBoard } from './CreateBoard';
import BoardService from '../../services/BoardService';
import toast from 'react-hot-toast';
import { boardPayloadFactory } from '../../test-utils/factories';

jest.mock('../../services/BoardService');
jest.mock('react-hot-toast');

describe('CreateBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<CreateBoard />);
    expect(screen.getByText('Create Board', { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByLabelText('Board Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Board Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Board' })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    render(<CreateBoard />);
    
    const submitBtn = screen.getByRole('button', { name: 'Create Board' });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Board name is required')).toBeInTheDocument();
    expect(await screen.findByText('Board description is required')).toBeInTheDocument();
    expect(BoardService.createBoard).not.toHaveBeenCalled();
  });

  it('calls BoardService and shows success toast on valid submission', async () => {
    (BoardService.createBoard as jest.Mock).mockResolvedValueOnce({ id: 1 });
    
    render(<CreateBoard />);
    
    fireEvent.change(screen.getByLabelText('Board Name'), { target: { value: 'New Board' } });
    fireEvent.change(screen.getByLabelText('Board Description'), { target: { value: 'Description here' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Board' }));

    await waitFor(() => {
      expect(BoardService.createBoard).toHaveBeenCalledWith(boardPayloadFactory());
      expect(toast.success).toHaveBeenCalledWith('Board created successfully!');
    });
  });

  it('shows error toast on API failure', async () => {
    (BoardService.createBoard as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    render(<CreateBoard />);
    
    fireEvent.change(screen.getByLabelText('Board Name'), { target: { value: 'New Board' } });
    fireEvent.change(screen.getByLabelText('Board Description'), { target: { value: 'Description here' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Board' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Board couldn't be created. Please try again.");
    });
  });
});
