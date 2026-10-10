import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';

import { AddBoardMembers } from './AddBoardMembers';
import BoardMemberService from '../../services/BoardMemberService';
import BoardService from '../../services/BoardService';
import OrganizationService from '../../services/OrganizationServices';
import {
  addBoardMembersSubmissionErrorCases,
  alreadyAddedConflictErrorFactory,
  alreadyTimedOutErrorFactory,
  boardLoadErrorFactory,
  boardMemberNetworkErrorFactory,
  boardResponseFactory,
  MOCK_EMAIL3,
  MOCK_BOARD_ID,
  MOCK_EMAIL,
  MOCK_EMAIL2,
  MOCK_ALREADY_TIMED_OUT_ERROR,
  MOCK_BOARD_MEMBER_NETWORK_ERROR,
  MOCK_INVALID_BOARD_ID,
  MOCK_ORG_MEMBER_ID,
  MOCK_ORG_MEMBER_ID_2,
  MOCK_ORG_MEMBER_ID_3,
  organizationMembersLoadErrorFactory,
  organizationMemberResponseFactory,
} from '../../test-utils/factories';

const mockNavigate = jest.fn();
let mockBoardId = String(MOCK_BOARD_ID);

jest.mock('react-hot-toast');
jest.mock('../../services/BoardService');
jest.mock('../../services/OrganizationServices');
jest.mock('../../services/BoardMemberService');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({
    boardId: mockBoardId,
  }),
}));

describe('AddBoardMembers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBoardId = String(MOCK_BOARD_ID);

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

  it('shows an error and skips API calls when the board ID is invalid', async () => {
    mockBoardId = MOCK_INVALID_BOARD_ID;

    render(<AddBoardMembers />);

    expect(toast.error).toHaveBeenCalledWith('Board information is missing.');
    expect(BoardService.getBoard).not.toHaveBeenCalled();
    expect(OrganizationService.getOrganizationMembers).not.toHaveBeenCalled();
  });

  it('renders the organization members and allows selection', async () => {
    render(<AddBoardMembers />);

    expect(screen.getByText('Loading members...')).toBeInTheDocument();

    expect(await screen.findByText(MOCK_EMAIL)).toBeInTheDocument();
    expect(screen.getByText(MOCK_EMAIL2)).toBeInTheDocument();
    expect(screen.getByText('Organization members')).toBeInTheDocument();
    expect(screen.getByText('0 selected')).toBeInTheDocument();
    const addMembersButton = screen.getByRole('button', { name: /add members/i });
    expect(addMembersButton).toBeDisabled();

    const firstMemberButton = screen.getByRole('button', { name: new RegExp(MOCK_EMAIL, 'i') });
    await userEvent.click(firstMemberButton);

    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(addMembersButton).not.toBeDisabled();
  });

  it('navigates to the board when skipping member selection', async () => {
    const user = userEvent.setup();

    render(<AddBoardMembers />);

    await user.click(screen.getByRole('button', { name: /skip for now/i }));

    expect(mockNavigate).toHaveBeenCalledWith(`/task-board/${MOCK_BOARD_ID}`);
    expect(BoardMemberService.addOrgMemberToBoard).not.toHaveBeenCalled();
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
          canEdit: false,
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
        { email: MOCK_EMAIL, canEdit: false, canView: true },
      );
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        2,
        MOCK_BOARD_ID,
        MOCK_ORG_MEMBER_ID_2,
        { email: MOCK_EMAIL2, canEdit: false, canView: true },
      );
    });
  });

  it('grants edit permission when the owner enables it', async () => {
    const user = userEvent.setup();
    const firstMember = organizationMemberResponseFactory({
      orgMemberId: MOCK_ORG_MEMBER_ID,
      email: MOCK_EMAIL,
    });

    render(<AddBoardMembers />);

    await user.click(await screen.findByRole('checkbox', { name: /added members can edit this board/i }));
    await user.click(screen.getByRole('button', { name: new RegExp(MOCK_EMAIL, 'i') }));
    await user.click(screen.getByRole('button', { name: /add members/i }));

    await waitFor(() => {
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledWith(
        MOCK_BOARD_ID,
        firstMember.orgMemberId,
        { email: firstMember.email, canEdit: true, canView: true },
      );
    });
  });

  it('keeps only failed members selected when some additions succeed and treats 409 as already added', async () => {
    const user = userEvent.setup();
    const thirdMember = organizationMemberResponseFactory({
      orgMemberId: MOCK_ORG_MEMBER_ID_3,
      email: MOCK_EMAIL3,
    });

    (OrganizationService.getOrganizationMembers as jest.Mock).mockResolvedValueOnce([
      organizationMemberResponseFactory({ orgMemberId: MOCK_ORG_MEMBER_ID, email: MOCK_EMAIL }),
      organizationMemberResponseFactory({ orgMemberId: MOCK_ORG_MEMBER_ID_2, email: MOCK_EMAIL2 }),
      thirdMember,
    ]);

    (BoardMemberService.addOrgMemberToBoard as jest.Mock)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(alreadyAddedConflictErrorFactory())
      .mockRejectedValueOnce(boardMemberNetworkErrorFactory());

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    await user.click(screen.getByText(MOCK_EMAIL2));
    await user.click(screen.getByText(thirdMember.email));
    await user.click(screen.getByRole('button', { name: /add members/i }));

    await waitFor(() => {
      expect(screen.getByText('1 selected')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: new RegExp(MOCK_EMAIL, 'i') }),
      ).toHaveAttribute('aria-pressed', 'false');
      expect(
        screen.getByRole('button', { name: new RegExp(MOCK_EMAIL2, 'i') }),
      ).toHaveAttribute('aria-pressed', 'false');
      expect(
        screen.getByRole('button', { name: new RegExp(thirdMember.email, 'i') }),
      ).toHaveAttribute('aria-pressed', 'true');
      expect(toast.success).toHaveBeenCalledWith('2 member(s) added successfully.');
      expect(toast.error).toHaveBeenCalledWith(MOCK_BOARD_MEMBER_NETWORK_ERROR);
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        1,
        MOCK_BOARD_ID,
        MOCK_ORG_MEMBER_ID,
        { email: MOCK_EMAIL, canEdit: false, canView: true },
      );
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        2,
        MOCK_BOARD_ID,
        MOCK_ORG_MEMBER_ID_2,
        { email: MOCK_EMAIL2, canEdit: false, canView: true },
      );
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        3,
        MOCK_BOARD_ID,
        thirdMember.orgMemberId,
        { email: thirdMember.email, canEdit: false, canView: true },
      );
    });
  });

  it('treats a 409 conflict as an already-added member', async () => {
    const user = userEvent.setup();

    (BoardMemberService.addOrgMemberToBoard as jest.Mock).mockRejectedValueOnce(
      alreadyAddedConflictErrorFactory(),
    );

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    await user.click(screen.getByRole('button', { name: /add members/i }));

    await waitFor(() => {
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith('Board members added successfully!');
      expect(mockNavigate).toHaveBeenCalledWith(`/task-board/${MOCK_BOARD_ID}`);
    });
  });

  it('treats an unrelated error containing "already" as a failure', async () => {
    const user = userEvent.setup();

    (BoardMemberService.addOrgMemberToBoard as jest.Mock).mockRejectedValueOnce(
      alreadyTimedOutErrorFactory(),
    );

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    await user.click(screen.getByRole('button', { name: /add members/i }));

    await waitFor(() => {
      expect(screen.getByText('1 selected')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: new RegExp(MOCK_EMAIL, 'i') }),
      ).toHaveAttribute('aria-pressed', 'true');
      expect(toast.error).toHaveBeenCalledWith(MOCK_ALREADY_TIMED_OUT_ERROR);
      expect(toast.success).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it.each(addBoardMembersSubmissionErrorCases())(
    'shows the expected message for a %s',
    async (_description, error, expectedMessage) => {
      const user = userEvent.setup();

      (BoardMemberService.addOrgMemberToBoard as jest.Mock).mockRejectedValueOnce(
        error,
      );

      render(<AddBoardMembers />);

      await user.click(await screen.findByText(MOCK_EMAIL));
      await user.click(screen.getByRole('button', { name: /add members/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(expectedMessage);
      });
    },
  );

  it('shows an error and skips organization loading when board loading fails', async () => {
    const user = userEvent.setup();
    (BoardService.getBoard as jest.Mock).mockRejectedValueOnce(
      boardLoadErrorFactory(),
    );

    render(<AddBoardMembers />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Members couldn't be loaded. Please try again.",
      );
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load organization members.',
    );
    expect(screen.queryByText('No organization members are available yet.')).not.toBeInTheDocument();
    expect(OrganizationService.getOrganizationMembers).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByText(MOCK_EMAIL)).toBeInTheDocument();
  });

  it('shows an error when organization member loading fails', async () => {
    const user = userEvent.setup();
    (OrganizationService.getOrganizationMembers as jest.Mock).mockRejectedValueOnce(
      organizationMembersLoadErrorFactory(),
    );

    render(<AddBoardMembers />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Members couldn't be loaded. Please try again.",
      );
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load organization members.',
    );
    expect(screen.queryByText('No organization members are available yet.')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByText(MOCK_EMAIL)).toBeInTheDocument();
  });

  it('shows a friendly state when there are no members to add', async () => {
    (OrganizationService.getOrganizationMembers as jest.Mock).mockResolvedValueOnce([]);

    render(<AddBoardMembers />);

    expect(await screen.findByText('No organization members are available yet.')).toBeInTheDocument();
    expect(screen.getByText('0 selected')).toBeInTheDocument();
  });
});
