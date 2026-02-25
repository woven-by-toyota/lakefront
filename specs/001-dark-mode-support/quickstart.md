# Quickstart: Universal Dark Mode Implementation

**Date**: 2026-02-25
**Target**: Developers implementing dark mode theme support for Lakefront components
**Prerequisites**: React 18+, @emotion/react, @emotion/styled

## Overview

This guide provides step-by-step instructions for converting Lakefront components to support universal dark mode theming. The approach follows the proven pattern from Table and Modal components (PR #356).

## Phase-by-Phase Implementation Guide

### Phase 1: Critical Components (StatusTable, Select, PlaybackBar, TypeaheadSearch)

These components have the highest impact and most complex conversion requirements.

#### Step 1: Analyze Current Implementation

**Before starting, identify these patterns in your component:**

```bash
# Search for hardcoded colors
grep -r "theme\?\.colors\." src/components/YourComponent/

# Search for ThemeProvider wrapping
grep -r "ThemeProvider" src/components/YourComponent/

# Search for direct color imports
grep -r "from.*lakefrontColors" src/components/YourComponent/
```

#### Step 2: Convert Styled Components

**Find and Replace Patterns:**

```typescript
// ❌ Before: Hardcoded color references
const StyledComponent = styled.div(({ theme }) => ({
  backgroundColor: theme?.colors?.white,
  color: theme?.colors?.storm,
  borderColor: theme?.colors?.mercury,
  fontSize: 14,
  fontFamily: 'Arial, sans-serif'
}));

// ✅ After: Semantic theme tokens
const StyledComponent = styled.div(({ theme }) => ({
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  borderColor: theme.borderColors.primary,
  ...theme.lettering.primary
}));
```

**Common Conversion Mappings:**

| Old Pattern | New Pattern | Usage |
|-------------|-------------|-------|
| `theme?.colors?.white` | `theme.backgrounds.primary` | Main backgrounds |
| `theme?.colors?.storm` | `theme.foregrounds.primary` | Primary text |
| `theme?.colors?.dolphin` | `theme.foregrounds.secondary` | Secondary text |
| `theme?.colors?.mercury` | `theme.borderColors.primary` | Standard borders |
| `theme?.colors?.pavement` | `theme.foregrounds.tableHeading` | Table headers |
| `theme?.colors?.watermelon` | `theme.foregrounds.alert` | Error/alert content |
| `theme?.colors?.selago` | `theme.borderColors.primary` | Light borders |

#### Step 3: Remove ThemeProvider Wrapping

**Find components with self-wrapping:**

```typescript
// ❌ Before: Component self-wraps with ThemeProvider
const MyComponent = ({ children, ...props }) => (
  <ThemeProvider theme={theme}>
    <StyledWrapper {...props}>
      {children}
    </StyledWrapper>
  </ThemeProvider>
);

// ✅ After: Component consumes theme from parent context
const MyComponent = ({ children, ...props }) => (
  <StyledWrapper {...props}>
    {children}
  </StyledWrapper>
);
```

#### Step 4: Update Tests

**Convert test imports:**

```typescript
// ❌ Before
import { render } from '@testing-library/react';

// ✅ After
import { renderWithTheme as render } from 'src/lib/testing';
```

**Add dual-theme testing:**

```typescript
describe('MyComponent', () => {
  it('renders correctly in light theme', () => {
    const { container } = render(<MyComponent />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly in dark theme', () => {
    const { container } = render(<MyComponent />, DARK_THEME);
    expect(container).toMatchSnapshot();
  });
});
```

#### Step 5: Validate Conversion

**Automated Validation:**

```bash
# Check for remaining hardcoded colors
npm run lint-check-colors src/components/YourComponent/

# Run theme-specific tests
npm test -- --testNamePattern="theme" src/components/YourComponent/

# Visual verification in Storybook
npm run storybook
# Navigate to your component and toggle themes
```

### Phase 2: ThemeProvider Removal (Drawer, Loading, Toggle, ProgressBar)

These components primarily need ThemeProvider wrapper removal.

#### Quick Conversion Steps:

1. **Remove ThemeProvider Import:**
   ```typescript
   // Remove this line
   import { ThemeProvider } from '@emotion/react';
   ```

2. **Remove ThemeProvider Wrapper:**
   ```typescript
   // Remove the ThemeProvider wrapper, keep the content
   return <StyledComponent>{children}</StyledComponent>;
   ```

3. **Update Tests:**
   ```typescript
   import { renderWithTheme as render } from 'src/lib/testing';
   ```

4. **Test Theme Inheritance:**
   ```typescript
   it('inherits theme from parent context', () => {
     const { container } = render(
       <ThemeProvider theme={DARK_THEME}>
         <MyComponent />
       </ThemeProvider>
     );
     // Verify dark theme styles are applied
   });
   ```

### Phase 3: Color Standardization (RadioGroup, Checkbox, Filter, Snackbar, TransferList)

#### Standard Conversion Process:

1. **Replace Direct Color Imports:**
   ```typescript
   // ❌ Remove these imports
   import colors from 'src/styles/lakefrontColors';

   // ✅ Use theme tokens instead
   const StyledComponent = styled.div(({ theme }) => ({
     backgroundColor: theme.backgrounds.primary
   }));
   ```

2. **Convert Hardcoded Hex Values:**
   ```typescript
   // ❌ Before
   backgroundColor: '#ffffff',
   color: '#333333'

   // ✅ After
   backgroundColor: theme.backgrounds.primary,
   color: theme.foregrounds.primary
   ```

3. **Update State-Based Styling:**
   ```typescript
   const StyledComponent = styled.div<{ state: 'error' | 'warning' | 'success' }>(
     ({ theme, state }) => ({
       backgroundColor: theme.backgrounds.primary,

       ...(state === 'error' && {
         color: theme.foregrounds.error,
         backgroundColor: theme.backgrounds.error
       }),

       ...(state === 'success' && {
         color: theme.foregrounds.success
       })
     })
   );
   ```

## Application Integration Guide

### Setting Up Theme Switching

**Basic Implementation:**

```typescript
import React, { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { THEME, DARK_THEME } from '@woven-planet/lakefront';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? DARK_THEME : THEME}>
      <div>
        <button onClick={() => setIsDarkMode(!isDarkMode)}>
          Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>

        {/* Your Lakefront components */}
        <YourComponents />
      </div>
    </ThemeProvider>
  );
}
```

**Advanced Implementation with Persistence:**

```typescript
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { THEME, DARK_THEME } from '@woven-planet/lakefront';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const theme = isDarkMode ? DARK_THEME : THEME;

  return { theme, isDarkMode, toggleTheme };
}

export default function App() {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <YourApplication />
    </ThemeProvider>
  );
}
```

## Testing Strategy

### Component-Level Testing

**Test Checklist for Each Component:**

- [ ] Renders without errors in light theme
- [ ] Renders without errors in dark theme
- [ ] Snapshots updated for both themes
- [ ] Interactive states work in both themes
- [ ] Accessibility maintained in both themes
- [ ] No hardcoded colors remain
- [ ] Theme switching works smoothly

**Test Implementation:**

```typescript
import { renderWithTheme as render } from 'src/lib/testing';
import { THEME, DARK_THEME } from 'src/styles/theme';

describe('MyComponent Theme Support', () => {
  const themes = [
    { theme: THEME, name: 'light' },
    { theme: DARK_THEME, name: 'dark' }
  ];

  themes.forEach(({ theme, name }) => {
    it(`renders correctly in ${name} theme`, () => {
      const { container } = render(<MyComponent />, theme);
      expect(container.firstChild).toBeInTheDocument();
      expect(container).toMatchSnapshot(`${name}-theme`);
    });

    it(`applies correct ${name} theme colors`, () => {
      const { container } = render(<MyComponent />, theme);
      const element = container.firstChild as HTMLElement;

      expect(element).toHaveStyle({
        backgroundColor: theme.backgrounds.primary,
        color: theme.foregrounds.primary
      });
    });
  });
});
```

### Integration Testing

**Theme Switching Test:**

```typescript
it('updates styling when theme changes', async () => {
  const ThemeWrapper = ({ theme, children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );

  const { rerender, container } = render(
    <ThemeWrapper theme={THEME}>
      <MyComponent />
    </ThemeWrapper>
  );

  const element = container.firstChild as HTMLElement;
  const lightBg = window.getComputedStyle(element).backgroundColor;

  rerender(
    <ThemeWrapper theme={DARK_THEME}>
      <MyComponent />
    </ThemeWrapper>
  );

  const darkBg = window.getComputedStyle(element).backgroundColor;
  expect(lightBg).not.toBe(darkBg);
});
```

## Troubleshooting

### Common Issues and Solutions

**Issue: Component doesn't change with theme**
```typescript
// Problem: Component still has hardcoded colors
backgroundColor: '#ffffff'

// Solution: Use semantic tokens
backgroundColor: theme.backgrounds.primary
```

**Issue: Theme switching breaks component**
```typescript
// Problem: Component self-wraps with ThemeProvider
<ThemeProvider theme={hardcodedTheme}>
  <MyComponent />
</ThemeProvider>

// Solution: Remove wrapper, inherit from parent
<MyComponent />
```

**Issue: Tests failing after conversion**
```typescript
// Problem: Tests not using theme-aware render
import { render } from '@testing-library/react';

// Solution: Use theme-aware render helper
import { renderWithTheme as render } from 'src/lib/testing';
```

**Issue: Storybook doesn't show theme toggle**
```typescript
// Solution: Add theme toggle to Storybook config
// .storybook/main.js - ensure theme addon is configured
```

### Performance Considerations

**Theme Switching Performance:**
- Use `React.memo` for components with stable props
- Avoid recreating theme-dependent objects in render
- Use stable theme object references

```typescript
const MyComponent = React.memo(({ stableProp }) => {
  // Memoized to prevent unnecessary re-renders during theme switches
  return <StyledComponent>{stableProp}</StyledComponent>;
});
```

### Development Workflow

**Daily Development Process:**

1. **Start Development:**
   ```bash
   npm run storybook  # Visual component development
   npm run test-watch # Continuous testing
   ```

2. **Convert Component:**
   - Follow phase-appropriate conversion steps
   - Update tests incrementally
   - Verify in both light and dark themes

3. **Validate Changes:**
   ```bash
   npm run lint      # Code quality
   npm test         # Theme-aware tests
   npm run build    # Integration check
   ```

4. **Visual Verification:**
   - Test in Storybook with both themes
   - Check color contrast and accessibility
   - Verify smooth theme transitions

This quickstart guide ensures systematic, reliable conversion of all Lakefront components to support universal dark mode theming while maintaining code quality and user experience.