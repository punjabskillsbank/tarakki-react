import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OrganizationCard } from './OrganizationCard';
import { adminOrganizationFactory } from '../../../../test-utils/factories';

describe('OrganizationCard', () => {
  it('renders organization summary details', () => {
    const organization = adminOrganizationFactory();

    render(<OrganizationCard organization={organization} onOpen={jest.fn()} />);

    expect(screen.getByText(/acme corporation/i)).toBeInTheDocument();
    expect(screen.getByText(/leading enterprise software solutions provider/i)).toBeInTheDocument();
    expect(screen.getByText(/24 members/i)).toBeInTheDocument();
    expect(screen.getByText(/john smith/i)).toBeInTheDocument();
  });

  it('invokes the open callback when clicked', () => {
    const onOpen = jest.fn();
    const organization = adminOrganizationFactory();

    render(<OrganizationCard organization={organization} onOpen={onOpen} />);

    fireEvent.click(screen.getByLabelText(/open acme corporation/i));

    expect(onOpen).toHaveBeenCalledWith('1');
  });
});
