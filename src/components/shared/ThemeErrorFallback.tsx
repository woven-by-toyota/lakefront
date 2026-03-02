import { FC, useEffect } from 'react';

interface ThemeErrorFallbackProps {
    componentName: string;
}

/**
 * A fallback component that displays an error message when theme is not available.
 * This should be used consistently across all components that require theme access.
 */
const ThemeErrorFallback: FC<ThemeErrorFallbackProps> = ({ componentName }) => {
    useEffect(() => {
        console.error(`${componentName}: No theme available. Make sure the component is wrapped in a ThemeProvider.`);
    }, [componentName]);

    return (
        <div
            style={{
                padding: '16px',
                border: '1px solid #ff6b6b',
                borderRadius: '4px',
                backgroundColor: '#ffe0e0',
                color: '#d63031',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                maxWidth: '300px'
            }}
        >
            <strong>Theme Error:</strong> No theme available for {componentName}
            <br />
            <small>Make sure the component is wrapped in a ThemeProvider.</small>
        </div>
    );
};

export default ThemeErrorFallback;