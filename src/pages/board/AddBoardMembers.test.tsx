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
  unrelatedConflictErrorFactory,
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
  MOCK_MEMBER_ID_2,
  organizationMembersLoadErrorFactory,
  organizationMemberResponseFactory,
  BOARD_INFORMATION_MISSING_MESSAGE,
  BOARD_MEMBERS_EDIT_ACCESS_LABEL,
  BOARD_MEMBERS_HEADING,
  BOARD_MEMBERS_LOADING_LABEL,
  BOARD_MEMBERS_ALL_ADDED_MESSAGE,
  BOARD_MEMBERS_NO_ORGANIZATION_MEMBERS_MESSAGE,
  BOARD_MEMBERS_RETRY_LABEL,
  BOARD_MEMBERS_SKIP_LABEL,
  BOARD_MEMBERS_SUBMIT_LABEL,
  BOARD_MEMBERS_SUCCESS_MESSAGE,
  boardMemberAccessFactory,
  boardMemberResponseFactory,
  boardRouteFactory,
  boardSelectedCountLabel,
  BOARD_MEMBER_ARIA_PRESSED_ATTRIBUTE,
  BOARD_MEMBER_SELECTED_VALUE,
  boardMembersAddedCountMessage,
  caseInsensitiveRegexFactory,
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
    (BoardMemberService.getBoardMembers as jest.Mock).mockResolvedValue([]);
  });

  it('shows an error and skips API calls when the board ID is invalid', async () => {
    mockBoardId = MOCK_INVALID_BOARD_ID;

    render(<AddBoardMembers />);

    expect(toast.error).toHaveBeenCalledWith(BOARD_INFORMATION_MISSING_MESSAGE);
    expect(BoardService.getBoard).not.toHaveBeenCalled();
    expect(OrganizationService.getOrganizationMembers).not.toHaveBeenCalled();
  });

  it.each(['', '0', '01', '9007199254740992'])(
    'rejects invalid board ID "%s"',
    async (boardId) => {
      mockBoardId = boardId;

      render(<AddBoardMembers />);

      expect(toast.error).toHaveBeenCalledWith(BOARD_INFORMATION_MISSING_MESSAGE);
      expect(BoardService.getBoard).not.toHaveBeenCalled();
      expect(OrganizationService.getOrganizationMembers).not.toHaveBeenCalled();
    },
  );

  it('clears previous members and selection while loading a different board', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<AddBoardMembers />);

    await user.click(await screen.findByRole('button', { name: caseInsensitiveRegexFactory(MOCK_EMAIL) }));
    expect(screen.getByText(boardSelectedCountLabel(1))).toBeInTheDocument();

    mockBoardId = '20';
    (BoardService.getBoard as jest.Mock).mockReturnValueOnce(
      new Promise(() => {}),
    );
    rerender(<AddBoardMembers />);

    expect(screen.getByText(BOARD_MEMBERS_LOADING_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(MOCK_EMAIL)).not.toBeInTheDocument();
    expect(screen.getByText(boardSelectedCountLabel(0))).toBeInTheDocument();
  });

  it('renders the organization members and allows selection', async () => {
    render(<AddBoardMembers />);

    expect(screen.getByText(BOARD_MEMBERS_LOADING_LABEL)).toBeInTheDocument();

    expect(await screen.findByText(MOCK_EMAIL)).toBeInTheDocument();
    expect(screen.getByText(MOCK_EMAIL2)).toBeInTheDocument();
    expect(screen.getByText(BOARD_MEMBERS_HEADING)).toBeInTheDocument();
    expect(screen.getByText(boardSelectedCountLabel(0))).toBeInTheDocument();
    const addMembersButton = screen.getByRole('button', { name: BOARD_MEMBERS_SUBMIT_LABEL });
    expect(addMembersButton).toBeDisabled();

    const firstMemberButton = screen.getByRole('button', { name: caseInsensitiveRegexFactory(MOCK_EMAIL) });
    await userEvent.click(firstMemberButton);

    expect(screen.getByText(boardSelectedCountLabel(1))).toBeInTheDocument();
    expect(addMembersButton).not.toBeDisabled();
  });

  it('does not offer organization members already on the board', async () => {
    const existingMember = organizationMemberResponseFactory({
      orgMemberId: MOCK_ORG_MEMBER_ID,
      email: MOCK_EMAIL,
    });
    (OrganizationService.getOrganizationMembers as jest.Mock).mockResolvedValue([
      existingMember,
      organizationMemberResponseFactory({
        orgMemberId: MOCK_ORG_MEMBER_ID_2,
        memberId: MOCK_MEMBER_ID_2,
        email: MOCK_EMAIL2,
      }),
    ]);
    (BoardMemberService.getBoardMembers as jest.Mock).mockResolvedValue([
      boardMemberResponseFactory({ memberId: existingMember.memberId }),
    ]);

    render(<AddBoardMembers />);

    expect(await screen.findByText(MOCK_EMAIL2)).toBeInTheDocument();
    expect(screen.queryByText(MOCK_EMAIL)).not.toBeInTheDocument();
  });

  it('explains when every organization member is already on the board', async () => {
    const member = organizationMemberResponseFactory();
    (OrganizationService.getOrganizationMembers as jest.Mock).mockResolvedValueOnce([member]);
    (BoardMemberService.getBoardMembers as jest.Mock).mockResolvedValueOnce([
      boardMemberResponseFactory({ memberId: member.memberId }),
    ]);

    render(<AddBoardMembers />);

    expect(await screen.findByText(BOARD_MEMBERS_ALL_ADDED_MESSAGE)).toBeInTheDocument();
  });

  it('navigates to the board when skipping member selection', async () => {
    const user = userEvent.setup();

    render(<AddBoardMembers />);

    await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_SKIP_LABEL }));

    expect(mockNavigate).toHaveBeenCalledWith(boardRouteFactory(MOCK_BOARD_ID));
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
    await user.click(screen.getByRole('button', { name: caseInsensitiveRegexFactory(MOCK_EMAIL) }));

    const addMembersButton = screen.getByRole('button', { name: BOARD_MEMBERS_SUBMIT_LABEL });
    await user.click(addMembersButton);

    await waitFor(() => {
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledWith(
        MOCK_BOARD_ID,
        firstMember.orgMemberId,
        boardMemberAccessFactory(firstMember.email),
      );
      expect(toast.success).toHaveBeenCalledWith(BOARD_MEMBERS_SUCCESS_MESSAGE);
      expect(mockNavigate).toHaveBeenCalledWith(boardRouteFactory(MOCK_BOARD_ID));
    });
  });

  it('disables the add button while a submission is in progress', async () => {
    const user = userEvent.setup();
    let resolveRequest: (() => void) | undefined;
    (BoardMemberService.addOrgMemberToBoard as jest.Mock).mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    const addMembersButton = screen.getByRole('button', {
      name: BOARD_MEMBERS_SUBMIT_LABEL,
    });
    await user.click(addMembersButton);

    expect(addMembersButton).toBeDisabled();
    expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledTimes(1);

    resolveRequest?.();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(boardRouteFactory(MOCK_BOARD_ID));
    });
  });

  it('adds every selected organization member to the board', async () => {
    const user = userEvent.setup();

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    await user.click(screen.getByText(MOCK_EMAIL2));
    await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_SUBMIT_LABEL }));

    await waitFor(() => {
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledTimes(2);
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        1,
        MOCK_BOARD_ID,
        MOCK_ORG_MEMBER_ID,
        boardMemberAccessFactory(MOCK_EMAIL),
      );
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        2,
        MOCK_BOARD_ID,
        MOCK_ORG_MEMBER_ID_2,
        boardMemberAccessFactory(MOCK_EMAIL2),
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

    await user.click(await screen.findByRole('checkbox', { name: BOARD_MEMBERS_EDIT_ACCESS_LABEL }));
    await user.click(screen.getByRole('button', { name: caseInsensitiveRegexFactory(MOCK_EMAIL) }));
    await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_SUBMIT_LABEL }));

    await waitFor(() => {
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledWith(
        MOCK_BOARD_ID,
        firstMember.orgMemberId,
        boardMemberAccessFactory(firstMember.email, true),
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
    await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_SUBMIT_LABEL }));

    await waitFor(() => {
      expect(screen.getByText(boardSelectedCountLabel(1))).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: caseInsensitiveRegexFactory(MOCK_EMAIL) }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: caseInsensitiveRegexFactory(MOCK_EMAIL2) }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: caseInsensitiveRegexFactory(thirdMember.email) }),
      ).toHaveAttribute(BOARD_MEMBER_ARIA_PRESSED_ATTRIBUTE, BOARD_MEMBER_SELECTED_VALUE);
      expect(toast.success).toHaveBeenCalledWith(boardMembersAddedCountMessage(2));
      expect(toast.error).toHaveBeenCalledWith(
        `Couldn't add: ${thirdMember.email}. ${MOCK_BOARD_MEMBER_NETWORK_ERROR}`,
      );
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        1,
        MOCK_BOARD_ID,
        MOCK_ORG_MEMBER_ID,
        boardMemberAccessFactory(MOCK_EMAIL),
      );
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        2,
        MOCK_BOARD_ID,
        MOCK_ORG_MEMBER_ID_2,
        boardMemberAccessFactory(MOCK_EMAIL2),
      );
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenNthCalledWith(
        3,
        MOCK_BOARD_ID,
        thirdMember.orgMemberId,
        boardMemberAccessFactory(thirdMember.email),
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
    await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_SUBMIT_LABEL }));

    await waitFor(() => {
      expect(BoardMemberService.addOrgMemberToBoard).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith(BOARD_MEMBERS_SUCCESS_MESSAGE);
      expect(mockNavigate).toHaveBeenCalledWith(boardRouteFactory(MOCK_BOARD_ID));
    });
  });

  it('treats an unrelated error containing "already" as a failure', async () => {
    const user = userEvent.setup();

    (BoardMemberService.addOrgMemberToBoard as jest.Mock).mockRejectedValueOnce(
      alreadyTimedOutErrorFactory(),
    );

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_SUBMIT_LABEL }));

    await waitFor(() => {
      expect(screen.getByText(boardSelectedCountLabel(1))).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: caseInsensitiveRegexFactory(MOCK_EMAIL) }),
      ).toHaveAttribute(BOARD_MEMBER_ARIA_PRESSED_ATTRIBUTE, BOARD_MEMBER_SELECTED_VALUE);
      expect(toast.error).toHaveBeenCalledWith(
        `Couldn't add: ${MOCK_EMAIL}. ${MOCK_ALREADY_TIMED_OUT_ERROR}`,
      );
      expect(toast.success).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('treats any HTTP 409 response as an already-added member', async () => {
    const user = userEvent.setup();
    (BoardMemberService.addOrgMemberToBoard as jest.Mock).mockRejectedValueOnce(
      unrelatedConflictErrorFactory(),
    );

    render(<AddBoardMembers />);

    await user.click(await screen.findByText(MOCK_EMAIL));
    await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_SUBMIT_LABEL }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(BOARD_MEMBERS_SUCCESS_MESSAGE);
      expect(toast.error).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(boardRouteFactory(MOCK_BOARD_ID));
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
      await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_SUBMIT_LABEL }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          `Couldn't add: ${MOCK_EMAIL}. ${expectedMessage}`,
        );
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
        'board failure',
      );
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'board failure',
    );
    expect(screen.queryByText(BOARD_MEMBERS_NO_ORGANIZATION_MEMBERS_MESSAGE)).not.toBeInTheDocument();
    expect(OrganizationService.getOrganizationMembers).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_RETRY_LABEL }));
    expect(await screen.findByText(MOCK_EMAIL)).toBeInTheDocument();
  });

  it('preserves the organization member loading error', async () => {
    const user = userEvent.setup();
    (OrganizationService.getOrganizationMembers as jest.Mock).mockRejectedValueOnce(
      organizationMembersLoadErrorFactory(),
    );

    render(<AddBoardMembers />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'organization members failure',
      );
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'organization members failure',
    );
    expect(screen.queryByText(BOARD_MEMBERS_NO_ORGANIZATION_MEMBERS_MESSAGE)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: BOARD_MEMBERS_RETRY_LABEL }));
    expect(await screen.findByText(MOCK_EMAIL)).toBeInTheDocument();
  });

  it('shows a friendly state when there are no members to add', async () => {
    (OrganizationService.getOrganizationMembers as jest.Mock).mockResolvedValueOnce([]);

    render(<AddBoardMembers />);

    expect(await screen.findByText(BOARD_MEMBERS_NO_ORGANIZATION_MEMBERS_MESSAGE)).toBeInTheDocument();
    expect(screen.getByText(boardSelectedCountLabel(0))).toBeInTheDocument();
  });
});
