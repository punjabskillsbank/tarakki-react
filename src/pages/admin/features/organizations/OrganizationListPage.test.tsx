import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { OrganizationListPage } from './OrganizationListPage';
import {
  adminOrganizationsFactory,
  OPEN_ORGANIZATION_LABEL_PREFIX,
  ORGANIZATIONS_PAGE_SUMMARY,
  TOTAL_ORGANIZATIONS_LABEL,
} from '../../../../test-utils/factories';

describe('OrganizationListPage', () => {
  it('renders the organizations heading and list summary', () => {
    const organizations = adminOrganizationsFactory();

    render(<OrganizationListPage organizations={organizations} onOpenOrganization={jest.fn()} />);

    expect(screen.getByRole('heading', { name: /organizations/i })).toBeInTheDocument();
    expect(screen.getByText(ORGANIZATIONS_PAGE_SUMMARY)).toBeInTheDocument();
    expect(screen.getByText(TOTAL_ORGANIZATIONS_LABEL)).toBeInTheDocument();
    expect(screen.getByText(`${organizations.length}`)).toBeInTheDocument();
  });

  it('passes the selected organization id through the open handler', async () => {
    const user = userEvent.setup();
    const onOpenOrganization = jest.fn();
    const organizations = adminOrganizationsFactory();

    render(<OrganizationListPage organizations={organizations} onOpenOrganization={onOpenOrganization} />);

    await user.click(screen.getByLabelText(`${OPEN_ORGANIZATION_LABEL_PREFIX}${organizations[0].name}`));

    expect(onOpenOrganization).toHaveBeenCalledWith('1');
  });
});
