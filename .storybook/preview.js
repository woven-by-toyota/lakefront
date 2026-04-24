import theme from 'src/styles/theme';
import { darkTheme } from '../src';
import { ThemeProvider } from '@emotion/react';

const themes = {
  light: {theme, background: theme.backgrounds.primary},
  dark: {theme: darkTheme, background: darkTheme.backgrounds.primary},
};


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    options: {
      default: {
        name: 'default',
        value: theme.colors.white,
      },

      alternate: {
        name: 'alternate',
        value: theme.colors.gunpowder,
      }
    }
  },
  controls: { expanded: true },
  previewTabs: {
    'storybook/docs/panel': {
      index: -1
    }
  }
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: ['light', 'dark'],
      showName: true,
    },
  },
};

export const decorators = [
  (Story, context) => {
    const mode = context.globals.theme || 'light';
    const current = themes[mode];

    return (
        <ThemeProvider theme={current.theme}>
          <div style={{
            backgroundColor: current.background,
            padding: '1rem',
            color: current.theme.foregrounds.primary || '#000',
          }}>
            <Story />
          </div>
        </ThemeProvider>
    );
  },
];


export const tags = ['autodocs'];

export const initialGlobals = {
  backgrounds: {
    value: 'default'
  }
};

