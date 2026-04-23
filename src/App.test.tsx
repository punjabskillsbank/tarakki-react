import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders Tarakki-React heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Tarakki-React/i);
    expect(headingElement).toBeInTheDocument();
  });
});
