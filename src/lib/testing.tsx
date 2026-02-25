import { render, RenderOptions } from '@testing-library/react';
import theme from 'src/styles/theme';
import { ThemeProvider } from '@emotion/react';
import { ReactElement } from 'react';

export const renderWithTheme = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
    render(ui, { wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>, ...options });
