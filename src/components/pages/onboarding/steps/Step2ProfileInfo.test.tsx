import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Step2ProfileInfo } from './Step2ProfileInfo';
import MemberServices from '../../../../services/MemberServices';
import '@testing-library/jest-dom';
import { onboardingDataFactory } from '../../../../test-utils/factories';

jest.mock('../../../../services/MemberServices');
const mockedMemberServices = MemberServices as jest.Mocked<typeof MemberServices>;

describe('Step2ProfileInfo', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = onboardingDataFactory();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Doe')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    fireEvent.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('calls MemberServices and onNext when form is complete', async () => {
    mockedMemberServices.createMember.mockResolvedValueOnce({ id: 1 });
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    
    fireEvent.change(screen.getByPlaceholderText('e.g. John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Doe'), { target: { value: 'Doe' } });
    
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
      expect(updateData).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Doe', profilePhoto: undefined });
      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  it('disables button when fields are empty', () => {
    const emptyData = onboardingDataFactory({ firstName: '', lastName: '' });
    render(<Step2ProfileInfo onNext={onNext} onBack={onBack} data={emptyData} updateData={updateData} />);
    const button = screen.getByText('Set up my workspace');
    expect(button).toBeDisabled();
  });
});
