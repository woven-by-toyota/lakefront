import { render, RenderOptions } from '@testing-library/react';
import theme, { DARK_THEME } from 'src/styles/theme';
import { ThemeProvider } from '@emotion/react';
import { ReactElement } from 'react';
import { Theme } from '@emotion/react';

// Overload signatures for different usage patterns
export function renderWithTheme(ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): ReturnType<typeof render>;
export function renderWithTheme(ui: ReactElement, customTheme: Theme, options?: Omit<RenderOptions, 'queries'>): ReturnType<typeof render>;
export function renderWithTheme(ui: ReactElement, themeVariant: 'light' | 'dark', options?: Omit<RenderOptions, 'queries'>): ReturnType<typeof render>;

export function renderWithTheme(
    ui: ReactElement,
    themeOrOptions?: Theme | 'light' | 'dark' | Omit<RenderOptions, 'queries'>,
    options?: Omit<RenderOptions, 'queries'>
): ReturnType<typeof render> {
    let selectedTheme = theme;
    let renderOptions = {};

    // Parse parameters based on type
    if (typeof themeOrOptions === 'string') {
        // Theme variant string ('light' | 'dark')
        selectedTheme = themeOrOptions === 'dark' ? DARK_THEME : theme;
        renderOptions = options || {};
    } else if (themeOrOptions && typeof themeOrOptions === 'object' && 'colors' in themeOrOptions) {
        // Custom theme object
        selectedTheme = themeOrOptions as Theme;
        renderOptions = options || {};
    } else {
        // Options object or undefined
        renderOptions = themeOrOptions || {};
    }

    return render(ui, {
        wrapper: ({ children }) => <ThemeProvider theme={selectedTheme}>{children}</ThemeProvider>,
        ...renderOptions
    });
}
