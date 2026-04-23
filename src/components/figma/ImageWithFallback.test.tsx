import { render, screen, fireEvent } from '@testing-library/react';
import { ImageWithFallback } from './ImageWithFallback';
import '@testing-library/jest-dom';

describe('ImageWithFallback', () => {
  const testSrc = 'https://example.com/test.jpg';
  const testAlt = 'Test Image';

  it('renders the image with provided src and alt', () => {
    render(<ImageWithFallback src={testSrc} alt={testAlt} />);
    const img = screen.getByAltText(testAlt);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', testSrc);
  });

  it('renders fallback image when original image fails to load', () => {
    render(<ImageWithFallback src={testSrc} alt={testAlt} />);
    const img = screen.getByAltText(testAlt);

    // Simulate error
    fireEvent.error(img);

    const fallbackImg = screen.getByAltText('Error loading image');
    expect(fallbackImg).toBeInTheDocument();
    expect(fallbackImg.getAttribute('src')).toContain('data:image/svg+xml;base64');
    expect(fallbackImg).toHaveAttribute('data-original-url', testSrc);
  });

  it('passes additional props to the img element', () => {
    render(<ImageWithFallback src={testSrc} alt={testAlt} data-testid="custom-img" />);
    const img = screen.getByTestId('custom-img');
    expect(img).toBeInTheDocument();
  });
});
