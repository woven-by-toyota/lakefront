# Theme Provider Contract

**Version**: 1.0
**Date**: 2026-02-25
**Context**: Application-level theme provider interface

## Overview

Defines the contract for how applications provide theme context to Lakefront components, ensuring proper theme propagation and switching capabilities.

## Interface Definition

### ThemeProvider Integration

**Required Setup**:
```typescript
import { ThemeProvider } from '@emotion/react';
import { THEME, DARK_THEME } from '@woven-planet/lakefront';

// Application wrapper
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = isDarkMode ? DARK_THEME : THEME;

  return (
    <ThemeProvider theme={currentTheme}>
      {/* Application components */}
    </ThemeProvider>
  );
}
```

**Contract Requirements**:

1. **Theme Object Completeness**
   - MUST provide complete theme object (all semantic tokens populated)
   - MUST use either exported THEME or DARK_THEME objects
   - MUST NOT provide partial theme objects or undefined values

2. **Theme Switching Protocol**
   - MUST replace entire theme object (not partial updates)
   - MUST trigger immediate re-styling of all child components
   - SHOULD provide smooth transition without visual artifacts

3. **Context Propagation**
   - MUST wrap all Lakefront components within ThemeProvider
   - MUST allow nested ThemeProvider for component-specific overrides
   - MUST maintain theme inheritance through component tree

## Consumer Contract

### Component Theme Access

**Standard Pattern**:
```typescript
import styled from '@emotion/styled';

const ThemedComponent = styled.div(({ theme }) => ({
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  border: `1px solid ${theme.borderColors.primary}`,
  ...theme.lettering.primary
}));
```

**Contract Guarantees**:

1. **Theme Availability**
   - Theme object WILL be available via emotion theme context
   - All semantic tokens WILL be populated and valid
   - Theme WILL remain consistent throughout component lifecycle

2. **Semantic Token Stability**
   - Token names WILL remain stable across versions
   - Token structure WILL maintain backwards compatibility
   - Token values WILL be valid CSS values

## Error Handling

### Missing Theme Context

**Behavior**: Components used outside ThemeProvider context
**Contract**: Components SHOULD degrade gracefully with fallback styling

```typescript
const ThemedComponent = styled.div(({ theme }) => ({
  backgroundColor: theme?.backgrounds?.primary || '#ffffff',
  color: theme?.foregrounds?.primary || '#000000'
}));
```

### Invalid Theme Object

**Behavior**: Theme object missing required semantic tokens
**Contract**: Application MUST provide complete theme or components MAY fail to render properly

**Validation Pattern**:
```typescript
const validateTheme = (theme: any): theme is LakefrontTheme => {
  return (
    theme?.backgrounds?.primary &&
    theme?.foregrounds?.primary &&
    theme?.borderColors?.primary &&
    theme?.lettering?.primary
  );
};
```

## Performance Requirements

### Theme Switch Performance
- Theme switching MUST complete within 100ms
- Component re-styling MUST be atomic (no partial updates visible)
- Memory usage MUST remain stable during theme switches

### Rendering Optimization
- Components SHOULD use React.memo for theme-stable props
- Styled components SHOULD avoid recreating styles on every render
- Theme objects SHOULD be memoized to prevent unnecessary re-renders

## Integration Examples

### Basic Application Integration
```typescript
import React, { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { THEME, DARK_THEME, Button, Card } from '@woven-planet/lakefront';

export default function ThemedApp() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? DARK_THEME : THEME}>
      <div>
        <Button onClick={() => setDarkMode(!darkMode)}>
          Switch to {darkMode ? 'Light' : 'Dark'} Theme
        </Button>
        <Card>
          <p>This content automatically adapts to theme changes</p>
        </Card>
      </div>
    </ThemeProvider>
  );
}
```

### Advanced Theme Persistence
```typescript
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { THEME, DARK_THEME } from '@woven-planet/lakefront';

export function PersistentThemedApp({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' ? DARK_THEME : THEME;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme === DARK_THEME ? 'dark' : 'light');
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
```

## Contract Violations and Remedies

### Violation: Component Self-Wrapping with ThemeProvider
**Problem**: Component creates its own ThemeProvider
**Impact**: Prevents theme inheritance, breaks theme switching
**Remedy**: Remove ThemeProvider wrapper, consume from parent context

### Violation: Hardcoded Color Usage
**Problem**: Component uses direct color values or theme.colors.*
**Impact**: Component doesn't respond to theme switching
**Remedy**: Convert to semantic tokens (theme.backgrounds.*, theme.foregrounds.*)

### Violation: Partial Theme Objects
**Problem**: Application provides incomplete theme object
**Impact**: Components may fail to style correctly
**Remedy**: Use complete THEME or DARK_THEME exports only