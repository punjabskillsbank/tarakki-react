import { render, screen, fireEvent } from '@testing-library/react';
import { Step6WhatToManage } from './Step6WhatToManage';
import '@testing-library/jest-dom';

describe('Step6WhatToManage', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const updateData = jest.fn();
  const data = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and selects management area', () => {
    render(<Step6WhatToManage onNext={onNext} onBack={onBack} data={data} updateData={updateData} />);
    expect(screen.getByText(/Select what you'd like to manage first/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Product'));
    fireEvent.click(screen.getByText('Continue'));

    expect(updateData).toHaveBeenCalledWith({ whatToManage: 'Product' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
