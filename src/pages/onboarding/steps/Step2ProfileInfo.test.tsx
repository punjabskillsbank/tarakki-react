import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step2ProfileInfo } from './Step2ProfileInfo';
import MemberServices from '../../../services/MemberServices';
import '@testing-library/jest-dom';
import { MOCK_PASSWORD, MOCK_FIRST_NAME, MOCK_LAST_NAME, MOCK_EMAIL, MOCK_ACCOUNT_STATUS, MOCK_MEMBER_ID } from '../../../test-utils/factories';

jest.mock('../../../services/MemberServices');
const mockedMemberServices = MemberServices as jest.Mocked<typeof MemberServices>;

describe('Step2ProfileInfo', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const onErrorBack = jest.fn();
  const email = MOCK_EMAIL;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(Storage.prototype, 'setItem');
  });

  it('renders correctly', () => {
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} password={MOCK_PASSWORD} onErrorBack={onErrorBack} />);
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Doe')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} password={MOCK_PASSWORD} onErrorBack={onErrorBack} />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('calls MemberServices and onNext when form is complete', async () => {
    mockedMemberServices.createMember.mockResolvedValueOnce({ memberId: MOCK_MEMBER_ID });
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} password={MOCK_PASSWORD} onErrorBack={onErrorBack} />);
    
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('e.g. John'), MOCK_FIRST_NAME.toLowerCase());
    await user.type(screen.getByPlaceholderText('e.g. Doe'), MOCK_LAST_NAME.toLowerCase());
    
    const button = screen.getByText('Set up my workspace');
    await user.click(button);

    await waitFor(() => {
      expect(mockedMemberServices.createMember).toHaveBeenCalledWith({
        firstName: MOCK_FIRST_NAME,
        lastName: MOCK_LAST_NAME,
        email: MOCK_EMAIL,
        passwordHash: MOCK_PASSWORD,
        profilePhotoS3Key: "",
        accountStatus: MOCK_ACCOUNT_STATUS
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('memberId', MOCK_MEMBER_ID);
      expect(localStorage.setItem).toHaveBeenCalledWith('firstName', MOCK_FIRST_NAME);
      expect(localStorage.setItem).toHaveBeenCalledWith('lastName', MOCK_LAST_NAME);
      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  it('trims and formats names before calling MemberServices', async () => {
    mockedMemberServices.createMember.mockResolvedValueOnce({ memberId: MOCK_MEMBER_ID });
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} password={MOCK_PASSWORD} onErrorBack={onErrorBack} />);
    
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('e.g. John'), `  ${MOCK_FIRST_NAME.toLowerCase()}  `);
    await user.type(screen.getByPlaceholderText('e.g. Doe'), `  ${MOCK_LAST_NAME.toLowerCase()}  `);
    
    await user.click(screen.getByText('Set up my workspace'));

    await waitFor(() => {
      expect(mockedMemberServices.createMember).toHaveBeenCalledWith(expect.objectContaining({
        firstName: MOCK_FIRST_NAME,
        lastName: MOCK_LAST_NAME
      }));
    });
  });

  it('calls onErrorBack when duplicate email error occurs', async () => {
    mockedMemberServices.createMember.mockRejectedValueOnce(new Error('Member already exists'));
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} password={MOCK_PASSWORD} onErrorBack={onErrorBack} />);
    
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('e.g. John'), MOCK_FIRST_NAME);
    await user.type(screen.getByPlaceholderText('e.g. Doe'), MOCK_LAST_NAME);
    
    await user.click(screen.getByText('Set up my workspace'));

    await waitFor(() => {
      expect(onErrorBack).toHaveBeenCalledWith('Member with this email already exists.');
    });
  });

  it('handles non-Error exceptions correctly', async () => {
    mockedMemberServices.createMember.mockRejectedValueOnce('Member already exists');
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} password={MOCK_PASSWORD} onErrorBack={onErrorBack} />);
    
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('e.g. John'), MOCK_FIRST_NAME);
    await user.type(screen.getByPlaceholderText('e.g. Doe'), MOCK_LAST_NAME);
    
    await user.click(screen.getByText('Set up my workspace'));

    await waitFor(() => {
      expect(onErrorBack).toHaveBeenCalledWith('Member with this email already exists.');
    });
  });

  it('disables button when fields are empty', () => {
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} password={MOCK_PASSWORD} onErrorBack={onErrorBack} />);
    const button = screen.getByText('Set up my workspace');
    expect(button).toBeDisabled();
  });
});
