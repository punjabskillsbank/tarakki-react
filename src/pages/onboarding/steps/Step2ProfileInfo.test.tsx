import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Step2ProfileInfo } from './Step2ProfileInfo';
import MemberServices from '../../../services/MemberServices';
import '@testing-library/jest-dom';

jest.mock('../../../services/MemberServices');
const mockedMemberServices = MemberServices as jest.Mocked<typeof MemberServices>;

describe('Step2ProfileInfo', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const onErrorBack = jest.fn();
  const email = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(Storage.prototype, 'setItem');
  });

  it('renders correctly', () => {
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} onErrorBack={onErrorBack} />);
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Doe')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} onErrorBack={onErrorBack} />);
    fireEvent.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('calls MemberServices and onNext when form is complete', async () => {
    mockedMemberServices.createMember.mockResolvedValueOnce({ memberId: 1 });
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} onErrorBack={onErrorBack} />);
    
    fireEvent.change(screen.getByPlaceholderText('e.g. John'), { target: { value: 'john' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Doe'), { target: { value: 'doe' } });
    
    const button = screen.getByText('Set up my workspace');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedMemberServices.createMember).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        profilePhotoS3Key: "",
        accountStatus: "ACTIVE"
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('memberId', '1');
      expect(localStorage.setItem).toHaveBeenCalledWith('firstName', 'John');
      expect(localStorage.setItem).toHaveBeenCalledWith('lastName', 'Doe');
      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onErrorBack when duplicate email error occurs', async () => {
    mockedMemberServices.createMember.mockRejectedValueOnce(new Error('Member with email test@example.com already exists.'));
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} onErrorBack={onErrorBack} />);
    
    fireEvent.change(screen.getByPlaceholderText('e.g. John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Doe'), { target: { value: 'Doe' } });
    
    fireEvent.click(screen.getByText('Set up my workspace'));

    await waitFor(() => {
      expect(onErrorBack).toHaveBeenCalledWith('Member with this email already exists.');
    });
  });

  it('disables button when fields are empty', () => {
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} email={email} onErrorBack={onErrorBack} />);
    const button = screen.getByText('Set up my workspace');
    expect(button).toBeDisabled();
  });
});
