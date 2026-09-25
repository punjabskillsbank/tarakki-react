import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';

import { AddBoardMembers } from './AddBoardMembers';
import BoardMemberService from '../../services/BoardMemberService';
import BoardService from '../../services/BoardService';
import OrganizationService from '../../services/OrganizationServices';
import {
  boardResponseFactory,
  MOCK_BOARD_ID,
  MOCK_EMAIL,
  MOCK_EMAIL2,
  MOCK_ORG_MEMBER_ID,
  MOCK_ORG_MEMBER_ID_2,
  organizationMemberResponseFactory,
} from '../../test-utils/factories';

const mockNavigate = jest.fn();

jest.mock('react-hot-toast');
jest.mock('../../services/BoardService');
jest.mock('../../services/OrganizationServices');
jest.mock('../../services/BoardMemberService');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({
    boardId: String(MOCK_BOARD_ID),
  }),
}));

describe('AddBoardMembers', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const board = boardResponseFactory({
      boardId: MOCK_BOARD_ID,
      orgId: boardResponseFactory().orgId,
    });

    const firstMember = organizationMemberResponseFactory({
      orgMemberId: MOCK_ORG_MEMBER_ID,
      email: MOCK_EMAIL,
    });

    const secondMember = organizationMemberResponseFactory({
      orgMemberId: MOCK_ORG_MEMBER_ID_2,
      email: MOCK_EMAIL2,
    });

    (BoardService.getBoard as jest.Mock).mockResolvedValue(board);
    (OrganizationService.getOrganizationMembers as jest.Mock).mockResolvedValue([
      firstMember,
      secondMember,
    ]);
  });

  it('renders the organization members and allows selection', async () => {
    render(<AddBoardMembers />);

    expect(screen.getByText('Loading members...')).toBeInTheDocument();

    expect(await screen.findByText(MOCK_EMAIL)).toBeInTheDocument();
    expect(screen.getByText(MOCK_EMAIL2)).toBeInTheDocument();
    expect(screen.getByText('Organization members')).toBeInTheDocument();
    expect(screen.getByText('0 selected')).toBeInTheDocument();

    const firstMemberButton = screen.getByRole('button', { name: new RegExp(MOCK_EMAIL, 'i') });
    await userEvent.click(firstMemberButton);

    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add members/i })).not.toBeDisabled();
  });

  it('adds selected members to the board and navigates to the board', async () => {
    const user = userEvent.setup();
    const firstMember = organizationMemberResponseFactory({
      orgMemberId: MOCK_ORG_MEMBER_ID,
      email: MOCK_EMAIL,
    });

    render(<AddBoardMembers />);

    await screen.findByText(MOCK_EMAIL);
    await user.click(screen.getByRole('button', { name: new RegExp(MOCK_EMAIL, 'i') }));

    const addMembersButton = screen.getByRole('button', { name: /add members/i });
    await user.click(addMembersButton);

    await waitFor(() => {
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledWith(
        MOCK_BOARD_ID,
        firstMember.orgMemberId,
        {
          email: firstMember.email,
          canEdit: true,
          canView: true,
        },
      );
      expect(toast.success).toHaveBeenCalledWith('Board members added successfully!');
      expect(mockNavigate).toHaveBeenCalledWith(`/task-board/${MOCK_BOARD_ID}`);
    });
  });

  it('adds every selected organization member to the board', async () => {
    const user = userEvent.setup();

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    await user.click(screen.getByText(MOCK_EMAIL2));
    await user.click(screen.getByRole('button', { name: /add members/i }));

    await waitFor(() => {
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledTimes(2);
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        1,
        MOCK_BOARD_ID,
        MOCK_ORG_MEMBER_ID,
        { email: MOCK_EMAIL, canEdit: true, canView: true },
      );
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        2,
        MOCK_BOARD_ID,
        MOCK_ORG_MEMBER_ID_2,
        { email: MOCK_EMAIL2, canEdit: true, canView: true },
      );
    });
  });

  it('keeps only failed members selected when some additions succeed and treats 409 as already added', async () => {
    const user = userEvent.setup();

    (BoardMemberService.addOrgMemberToBoard as jest.Mock)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('network failure'));

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    await user.click(screen.getByText(MOCK_EMAIL2));
    await user.click(screen.getByRole('button', { name: /add members/i }));

    await waitFor(() => {
      expect(screen.getByText('1 selected')).toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith('1 member(s) added successfully.');
      expect(toast.error).toHaveBeenCalledWith('network failure');
    });
  });

  it('treats a 409 conflict as an already-added member', async () => {
    const user = userEvent.setup();

    (BoardMemberService.addOrgMemberToBoard as jest.Mock).mockRejectedValueOnce({
      response: { status: 409 },
    });

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    await user.click(screen.getByRole('button', { name: /add members/i }));

    await waitFor(() => {
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith('Board members added successfully!');
      expect(mockNavigate).toHaveBeenCalledWith(`/task-board/${MOCK_BOARD_ID}`);
    });
  });

  it('shows a friendly state when there are no members to add', async () => {
    (OrganizationService.getOrganizationMembers as jest.Mock).mockResolvedValueOnce([]);

    render(<AddBoardMembers />);

    expect(await screen.findByText('No organization members are available yet.')).toBeInTheDocument();
    expect(screen.getByText('0 selected')).toBeInTheDocument();
  });
});
