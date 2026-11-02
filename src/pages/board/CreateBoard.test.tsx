import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateBoard } from './CreateBoard';
import BoardService from '../../services/BoardService';
import toast from 'react-hot-toast';
import {
  boardPayloadFactory,
  boardResponseFactory,
  CREATE_BOARD_DESCRIPTION_CHARACTER_COUNT,
  CREATE_BOARD_DESCRIPTION_LABEL,
  CREATE_BOARD_DESCRIPTION_MAX_LENGTH,
  CREATE_BOARD_DESCRIPTION_REQUIRED_ERROR,
  CREATE_BOARD_FAILURE_MESSAGE,
  CREATE_BOARD_HEADING,
  CREATE_BOARD_NAME_CHARACTER_COUNT,
  CREATE_BOARD_NAME_LABEL,
  CREATE_BOARD_NAME_MAX_LENGTH,
  CREATE_BOARD_NAME_REQUIRED_ERROR,
  CREATE_BOARD_ORGANIZATION_MISSING_MESSAGE,
  CREATE_BOARD_SUCCESS_MESSAGE,
  addBoardMembersRouteFactory,
  createBoardApiErrorFactory,
} from '../../test-utils/factories';

jest.mock('../../services/BoardService');
jest.mock('react-hot-toast');

const mockNavigate = jest.fn();
let mockOrganizationId: string | undefined = String(boardPayloadFactory().orgId);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({
    orgId: mockOrganizationId,
  }),
}));

describe('CreateBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    const defaultPayload = boardPayloadFactory();
    mockOrganizationId = String(defaultPayload.orgId);

    localStorage.setItem('memberId', defaultPayload.createdBy);
  });

  it('renders the form correctly', () => {
    render(<CreateBoard />);
    expect(screen.getByText(CREATE_BOARD_HEADING, { selector: 'h1' })).toBeInTheDocument();
    const boardNameInput = screen.getByLabelText(CREATE_BOARD_NAME_LABEL);
    expect(boardNameInput).toBeInTheDocument();
    expect(boardNameInput).toHaveAttribute('maxLength', CREATE_BOARD_NAME_MAX_LENGTH);
    expect(screen.getByText(CREATE_BOARD_NAME_CHARACTER_COUNT)).toBeInTheDocument();
    
    const boardDescInput = screen.getByLabelText(CREATE_BOARD_DESCRIPTION_LABEL);
    expect(boardDescInput).toBeInTheDocument();
    expect(boardDescInput).toHaveAttribute('maxLength', CREATE_BOARD_DESCRIPTION_MAX_LENGTH);
    expect(screen.getByText(CREATE_BOARD_DESCRIPTION_CHARACTER_COUNT)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: CREATE_BOARD_HEADING })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    const user = userEvent.setup();
    render(<CreateBoard />);
    
    const submitBtn = screen.getByRole('button', { name: CREATE_BOARD_HEADING });
    await user.click(submitBtn);

    expect(await screen.findByText(CREATE_BOARD_NAME_REQUIRED_ERROR)).toBeInTheDocument();
    expect(await screen.findByText(CREATE_BOARD_DESCRIPTION_REQUIRED_ERROR)).toBeInTheDocument();
    expect(BoardService.createBoard).not.toHaveBeenCalled();
  });

  it('calls BoardService and shows success toast on valid submission', async () => {
    const user = userEvent.setup();
    const response = boardResponseFactory();
    (BoardService.createBoard as jest.Mock).mockResolvedValueOnce(response);
    
    render(<CreateBoard />);
    
    const payload = boardPayloadFactory();
    await user.type(screen.getByLabelText(CREATE_BOARD_NAME_LABEL), payload.boardName);
    await user.type(screen.getByLabelText(CREATE_BOARD_DESCRIPTION_LABEL), payload.boardDesc);
    
    await user.click(screen.getByRole('button', { name: CREATE_BOARD_HEADING }));

    await waitFor(() => {
      expect(BoardService.createBoard).toHaveBeenCalledWith(boardPayloadFactory());
      expect(toast.success).toHaveBeenCalledWith(CREATE_BOARD_SUCCESS_MESSAGE);
      expect(mockNavigate).toHaveBeenCalledWith(
        addBoardMembersRouteFactory(response.boardId),
      );
    });
  });

  it('shows error toast on API failure', async () => {
    const user = userEvent.setup();
    (BoardService.createBoard as jest.Mock).mockRejectedValueOnce(createBoardApiErrorFactory());
    
    render(<CreateBoard />);
    
    const payload = boardPayloadFactory();
    await user.type(screen.getByLabelText(CREATE_BOARD_NAME_LABEL), payload.boardName);
    await user.type(screen.getByLabelText(CREATE_BOARD_DESCRIPTION_LABEL), payload.boardDesc);
    
    await user.click(screen.getByRole('button', { name: CREATE_BOARD_HEADING }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(CREATE_BOARD_FAILURE_MESSAGE);
    });
  });

  it('does not create a board when the organization ID is missing', async () => {
    const user = userEvent.setup();
    const payload = boardPayloadFactory();
    mockOrganizationId = undefined;

    render(<CreateBoard />);

    await user.type(screen.getByLabelText(CREATE_BOARD_NAME_LABEL), payload.boardName);
    await user.type(screen.getByLabelText(CREATE_BOARD_DESCRIPTION_LABEL), payload.boardDesc);
    await user.click(screen.getByRole('button', { name: CREATE_BOARD_HEADING }));

    expect(toast.error).toHaveBeenCalledWith(CREATE_BOARD_ORGANIZATION_MISSING_MESSAGE);
    expect(BoardService.createBoard).not.toHaveBeenCalled();
  });
});
