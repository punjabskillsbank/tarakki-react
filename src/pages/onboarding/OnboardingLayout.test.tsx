import { render, screen } from '@testing-library/react';
import { OnboardingLayout } from './OnboardingLayout';
import '@testing-library/jest-dom';

describe('OnboardingLayout', () => {
  const illustration = 'https://example.com/ill.png';

  it('renders children and illustration', () => {
    render(
      <OnboardingLayout illustration={illustration}>
        <div data-testid="child">Test Child</div>
      </OnboardingLayout>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByAltText('Illustration')).toHaveAttribute('src', illustration);
  });

  it('applies correct gradient class for purple type', () => {
    const { container } = render(
      <OnboardingLayout illustration={illustration} gradientType="purple">
        <div>Test</div>
      </OnboardingLayout>
    );

    const gradientDiv = container.querySelector('.bg-gradient-to-br');
    expect(gradientDiv).toHaveClass('from-[#5F5FEF]');
  });

  it('applies correct gradient class for yellow type', () => {
    const { container } = render(
      <OnboardingLayout illustration={illustration} gradientType="yellow">
        <div>Test</div>
      </OnboardingLayout>
    );

    const gradientDiv = container.querySelector('.bg-gradient-to-br');
    expect(gradientDiv).toHaveClass('from-[#FFC700]');
  });
});
