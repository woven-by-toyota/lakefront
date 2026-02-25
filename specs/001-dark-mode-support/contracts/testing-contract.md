# Testing Contract

**Version**: 1.0
**Date**: 2026-02-25
**Context**: Component testing patterns for theme-aware components

## Overview

Defines the contract for testing Lakefront components with proper theme context, ensuring all components render correctly in both light and dark modes.

## Test Environment Requirements

### Theme Testing Setup

**Required Import Pattern**:
```typescript
// ❌ OLD: Direct render import
import { render } from '@testing-library/react';

// ✅ NEW: Theme-aware render helper
import { renderWithTheme as render } from 'src/lib/testing';
```

**Theme Testing Helper Contract**:
```typescript
interface ThemeTestingHelper {
  // Standard render with default light theme
  renderWithTheme(component: ReactElement, options?: RenderOptions): RenderResult;

  // Render with specific theme
  renderWithTheme(
    component: ReactElement,
    theme: LakefrontTheme,
    options?: RenderOptions
  ): RenderResult;

  // Render with theme variant
  renderWithTheme(
    component: ReactElement,
    themeVariant: 'light' | 'dark',
    options?: RenderOptions
  ): RenderResult;
}
```

### Test Implementation Requirements

**Basic Component Test**:
```typescript
import { renderWithTheme as render } from 'src/lib/testing';
import { THEME, DARK_THEME } from 'src/styles/theme';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly with light theme', () => {
    const { container } = render(<MyComponent />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with dark theme', () => {
    const { container } = render(<MyComponent />, DARK_THEME);
    expect(container).toMatchSnapshot();
  });
});
```

## Theme Testing Patterns

### Dual-Theme Rendering Tests

**Contract Requirement**: Every component MUST be tested in both light and dark themes

```typescript
describe('ThemedComponent', () => {
  const testCases = [
    { theme: THEME, name: 'light theme' },
    { theme: DARK_THEME, name: 'dark theme' }
  ];

  testCases.forEach(({ theme, name }) => {
    describe(`with ${name}`, () => {
      it('renders without crashing', () => {
        const { container } = render(<ThemedComponent />, theme);
        expect(container.firstChild).toBeInTheDocument();
      });

      it('applies correct theme colors', () => {
        const { container } = render(<ThemedComponent />, theme);
        const element = container.firstChild as HTMLElement;

        // Verify theme-based styling is applied
        expect(element).toHaveStyle({
          backgroundColor: theme.backgrounds.primary,
          color: theme.foregrounds.primary
        });
      });
    });
  });
});
```

### Interactive Theme Testing

**Theme Switching Test Pattern**:
```typescript
import { act } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';

it('updates styling when theme changes', () => {
  let currentTheme = THEME;

  const ThemeWrapper = ({ children }) => (
    <ThemeProvider theme={currentTheme}>
      {children}
    </ThemeProvider>
  );

  const { container, rerender } = render(
    <ThemeWrapper>
      <ThemedComponent />
    </ThemeWrapper>
  );

  const element = container.firstChild as HTMLElement;

  // Verify light theme styles
  expect(element).toHaveStyle({
    backgroundColor: THEME.backgrounds.primary
  });

  // Switch to dark theme
  act(() => {
    currentTheme = DARK_THEME;
    rerender(
      <ThemeWrapper>
        <ThemedComponent />
      </ThemeWrapper>
    );
  });

  // Verify dark theme styles applied
  expect(element).toHaveStyle({
    backgroundColor: DARK_THEME.backgrounds.primary
  });
});
```

### Accessibility Testing with Themes

**Contract Requirement**: Components MUST maintain accessibility across both themes

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('ThemedComponent Accessibility', () => {
  it('has no accessibility violations in light theme', async () => {
    const { container } = render(<ThemedComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in dark theme', async () => {
    const { container } = render(<ThemedComponent />, DARK_THEME);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('maintains focus visibility across themes', () => {
    const { container } = render(
      <button>Focusable Element</button>,
      DARK_THEME
    );

    const button = container.querySelector('button');
    button?.focus();

    // Verify focus styles are visible in dark theme
    expect(button).toHaveStyle({
      outline: expect.stringContaining('2px')
    });
  });
});
```

## Visual Regression Testing

### Snapshot Testing Requirements

**Theme Snapshot Contract**:
```typescript
describe('ThemedComponent Snapshots', () => {
  it('matches snapshot in light theme', () => {
    const { container } = render(<ThemedComponent prop="value" />);
    expect(container.firstChild).toMatchSnapshot('light-theme');
  });

  it('matches snapshot in dark theme', () => {
    const { container } = render(
      <ThemedComponent prop="value" />,
      DARK_THEME
    );
    expect(container.firstChild).toMatchSnapshot('dark-theme');
  });
});
```

### CSS-in-JS Testing

**Styled Component Testing Pattern**:
```typescript
import 'jest-styled-components';

describe('ThemedComponent Styles', () => {
  it('applies correct theme tokens in light mode', () => {
    const { container } = render(<ThemedComponent />);
    const element = container.firstChild;

    expect(element).toHaveStyleRule(
      'background-color',
      THEME.backgrounds.primary
    );

    expect(element).toHaveStyleRule(
      'color',
      THEME.foregrounds.primary
    );
  });

  it('applies correct theme tokens in dark mode', () => {
    const { container } = render(<ThemedComponent />, DARK_THEME);
    const element = container.firstChild;

    expect(element).toHaveStyleRule(
      'background-color',
      DARK_THEME.backgrounds.primary
    );

    expect(element).toHaveStyleRule(
      'color',
      DARK_THEME.foregrounds.primary
    );
  });
});
```

## Component State Testing

### State + Theme Interaction Testing

**Multi-State Theme Testing**:
```typescript
describe('ThemedComponent States', () => {
  const states = ['default', 'hover', 'active', 'disabled'];
  const themes = [
    { theme: THEME, name: 'light' },
    { theme: DARK_THEME, name: 'dark' }
  ];

  themes.forEach(({ theme, name }) => {
    states.forEach(state => {
      it(`renders ${state} state correctly in ${name} theme`, () => {
        const props = state === 'disabled' ? { disabled: true } : {};
        const { container } = render(
          <ThemedComponent {...props} />,
          theme
        );

        // Verify state-specific styling with theme
        const element = container.firstChild as HTMLElement;

        if (state === 'disabled') {
          expect(element).toHaveStyle({
            backgroundColor: theme.backgrounds.disabled,
            color: theme.foregrounds.disabled
          });
        } else {
          expect(element).toHaveStyle({
            backgroundColor: theme.backgrounds.primary,
            color: theme.foregrounds.primary
          });
        }
      });
    });
  });
});
```

## Test Migration Contract

### Legacy Test Updates

**Required Changes for Theme Compliance**:

1. **Import Updates**:
   ```typescript
   // Before
   import { render } from '@testing-library/react';

   // After
   import { renderWithTheme as render } from 'src/lib/testing';
   ```

2. **Snapshot Updates**:
   ```bash
   # Update snapshots after theme conversion
   npm test -- --updateSnapshot
   ```

3. **Style Assertions Updates**:
   ```typescript
   // Before: Hardcoded color assertions
   expect(element).toHaveStyle({ backgroundColor: '#ffffff' });

   // After: Theme token assertions
   expect(element).toHaveStyle({
     backgroundColor: THEME.backgrounds.primary
   });
   ```

### Test Coverage Requirements

**Mandatory Test Coverage**:
- ✅ Component renders without errors in both themes
- ✅ Component applies correct theme tokens
- ✅ Component maintains functionality across themes
- ✅ Component meets accessibility requirements in both themes
- ✅ Component handles theme switching gracefully

**Optional but Recommended**:
- Visual regression testing with screenshot comparison
- Performance testing for theme switching
- Cross-browser theme compatibility testing

## Test Utilities Contract

### Custom Testing Helpers

**Theme Testing Utilities**:
```typescript
// Test utility for theme property validation
export const expectThemeProperty = (
  element: HTMLElement,
  property: string,
  themeToken: string
) => {
  const computedStyle = window.getComputedStyle(element);
  const expectedValue = themeToken; // resolved token value
  expect(computedStyle.getPropertyValue(property)).toBe(expectedValue);
};

// Test utility for theme switching
export const testThemeSwitching = async (
  component: ReactElement,
  testId: string
) => {
  const { container, rerender } = render(component, THEME);
  const element = screen.getByTestId(testId);

  // Capture light theme styles
  const lightStyles = window.getComputedStyle(element);

  // Switch to dark theme
  rerender(<ThemeProvider theme={DARK_THEME}>{component}</ThemeProvider>);

  // Capture dark theme styles
  const darkStyles = window.getComputedStyle(element);

  // Verify styles changed
  expect(lightStyles.backgroundColor).not.toBe(darkStyles.backgroundColor);
  expect(lightStyles.color).not.toBe(darkStyles.color);
};
```

This testing contract ensures all components maintain proper theme support while preserving functionality and accessibility across light and dark modes.