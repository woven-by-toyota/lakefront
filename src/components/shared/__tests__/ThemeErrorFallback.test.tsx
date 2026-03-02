import { render, screen } from '@testing-library/react';
import ThemeErrorFallback from '../ThemeErrorFallback';

// Mock console.error to capture error messages
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ThemeErrorFallback', () => {
    afterEach(() => {
        mockConsoleError.mockClear();
    });

    afterAll(() => {
        mockConsoleError.mockRestore();
    });

    it('renders error message with component name', () => {
        render(<ThemeErrorFallback componentName="TestComponent" />);

        expect(screen.getByText('Theme Error:')).toBeInTheDocument();
        expect(screen.getByText(/No theme available for TestComponent/)).toBeInTheDocument();
        expect(screen.getByText(/Make sure the component is wrapped in a ThemeProvider/)).toBeInTheDocument();
    });

    it('logs console error with component name', () => {
        render(<ThemeErrorFallback componentName="MyComponent" />);

        expect(mockConsoleError).toHaveBeenCalledWith(
            'MyComponent: No theme available. Make sure the component is wrapped in a ThemeProvider.'
        );
    });

    it('has proper error styling', () => {
        const { container } = render(<ThemeErrorFallback componentName="TestComponent" />);
        const errorDiv = container.firstChild as HTMLElement;

        expect(errorDiv).toHaveStyle({
            backgroundColor: '#ffe0e0',
            border: '1px solid #ff6b6b',
            borderRadius: '4px',
            color: '#d63031'
        });
    });
});