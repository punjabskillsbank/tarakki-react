import { render, screen, fireEvent } from '@testing-library/react';
import { Step9InviteTeam } from './Step9InviteTeam';
import '@testing-library/jest-dom';

describe('Step9InviteTeam', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Step9InviteTeam onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/Who else is on your team\?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('teammate@company.com')).toBeInTheDocument();
  });

  it('adds a new member row', () => {
    render(<Step9InviteTeam onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    fireEvent.click(screen.getByText(/Add another/i));
    const inputs = screen.getAllByPlaceholderText('teammate@company.com');
    expect(inputs).toHaveLength(2);
  });

  it('calls onNext with team data on invite', () => {
    render(<Step9InviteTeam onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    const input = screen.getByPlaceholderText('teammate@company.com');
    fireEvent.change(input, { target: { value: 'member@test.com' } });
    fireEvent.click(screen.getByText('Invite your team'));

    expect(updateData).toHaveBeenCalledWith({
      teamMembers: [{ email: 'member@test.com', role: 'Admin' }]
    });
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls handleSkip on remind me later', () => {
    render(<Step9InviteTeam onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    fireEvent.click(screen.getByText('Remind me later'));
    expect(updateData).toHaveBeenCalledWith({ teamMembers: [] });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
