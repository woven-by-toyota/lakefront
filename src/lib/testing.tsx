import { ThemeProvider } from '@emotion/react';
import { type RenderOptions, render } from '@testing-library/react';
import type { ReactElement } from 'react';
import theme from 'src/styles/theme';

export const renderWithTheme = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
    render(ui, { wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>, ...options });
