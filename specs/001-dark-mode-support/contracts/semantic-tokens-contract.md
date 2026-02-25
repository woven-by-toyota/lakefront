# Semantic Tokens Contract

**Version**: 1.0
**Date**: 2026-02-25
**Context**: Component semantic token usage patterns and guidelines

## Overview

Defines the contract for how Lakefront components must consume semantic theme tokens to ensure consistent dark mode support and maintain design system coherence.

## Semantic Token Categories

### Background Tokens

**Usage Contract**: Define surface and background colors for components

```typescript
interface BackgroundTokens {
  primary: string;        // MUST use for: main component backgrounds, card surfaces
  secondary: string;      // MUST use for: secondary surfaces, sidebar backgrounds
  tertiary: string;       // MUST use for: tertiary surfaces, nested content areas
  widget: string;         // MUST use for: specialized widget backgrounds, controls
  disabled: string;       // MUST use for: disabled component backgrounds
  inverted: string;       // MUST use for: high-contrast backgrounds, dark-on-light
  hover: string;          // MUST use for: hover state backgrounds
  tinted: string;         // MUST use for: lightly tinted backgrounds, subtle emphasis
  error: string;          // MUST use for: error state backgrounds
  errorsInverted: string; // MUST use for: inverted error backgrounds
}
```

**Implementation Requirements**:
- Components MUST use `theme.backgrounds.primary` for main surfaces
- Components MUST use `theme.backgrounds.secondary` for nested or secondary surfaces
- Components MUST use `theme.backgrounds.hover` for interactive hover states
- Components MUST NOT use hardcoded background colors

### Foreground Tokens

**Usage Contract**: Define text and content colors for optimal readability

```typescript
interface ForegroundTokens {
  primary: string;        // MUST use for: primary text, main content
  secondary: string;      // MUST use for: secondary text, labels, captions
  error: string;          // MUST use for: error text, validation messages
  alert: string;          // MUST use for: alert icons, warning indicators
  disabled: string;       // MUST use for: disabled text and content
  info: string;           // MUST use for: informational text
  warning: string;        // MUST use for: warning text
  inverted: string;       // MUST use for: text on dark/inverted backgrounds
  success: string;        // MUST use for: success messages, positive indicators
  hyperlink: string;      // MUST use for: clickable links
  loading: string;        // MUST use for: loading indicators, progress states
  tableHeading: string;   // MUST use for: table headers, column titles
}
```

**Implementation Requirements**:
- Components MUST use `theme.foregrounds.primary` for primary text content
- Components MUST use `theme.foregrounds.secondary` for secondary/supporting text
- Components MUST use semantic meaning tokens (`error`, `warning`, `success`) for state-based content
- Components MUST NOT use hardcoded text colors

### Border Tokens

**Usage Contract**: Define border and divider colors for visual separation

```typescript
interface BorderTokens {
  primary: string;        // MUST use for: standard borders, component outlines
  secondary: string;      // MUST use for: secondary borders, subtle separators
  disabled: string;       // MUST use for: disabled component borders
  inverted: string;       // MUST use for: inverted border colors
  pronounced: string;     // MUST use for: emphasized borders, focus states
}
```

**Implementation Requirements**:
- Components MUST use `theme.borderColors.primary` for standard borders
- Components MUST use `theme.borderColors.pronounced` for focus or emphasized states
- Components MUST NOT use hardcoded border colors

### Typography Tokens

**Usage Contract**: Define consistent typography styling across components

```typescript
interface TypographyTokens {
  primary: TypographyStyle;    // MUST use for: base text styling
  secondary: TypographyStyle;  // MUST use for: secondary text styling
  h1: TypographyStyle;         // MUST use for: main headings
  h2: TypographyStyle;         // MUST use for: section headings
  h3: TypographyStyle;         // MUST use for: subsection headings
  h4: TypographyStyle;         // MUST use for: component titles
  h5: TypographyStyle;         // MUST use for: component subtitles
  h6: TypographyStyle;         // MUST use for: small headings
}
```

**Implementation Requirements**:
- Components MUST spread typography objects: `...theme.lettering.primary`
- Components MUST use appropriate heading levels for hierarchical content
- Components MUST NOT hardcode font properties

## Usage Patterns

### Standard Component Pattern

**Correct Implementation**:
```typescript
const ThemedButton = styled.button(({ theme, variant }) => ({
  // Background
  backgroundColor: theme.backgrounds.primary,

  // Text
  color: theme.foregrounds.primary,
  ...theme.lettering.primary,

  // Border
  border: `1px solid ${theme.borderColors.primary}`,

  // Interactive states
  '&:hover': {
    backgroundColor: theme.backgrounds.hover
  },

  '&:disabled': {
    backgroundColor: theme.backgrounds.disabled,
    color: theme.foregrounds.disabled,
    borderColor: theme.borderColors.disabled
  }
}));
```

**Contract Violations**:
```typescript
// ❌ VIOLATION: Hardcoded colors
const BadButton = styled.button({
  backgroundColor: '#ffffff',
  color: '#333333',
  border: '1px solid #cccccc'
});

// ❌ VIOLATION: Direct color palette access
const BadButton2 = styled.button(({ theme }) => ({
  backgroundColor: theme.colors.white,
  color: theme.colors.storm
}));

// ❌ VIOLATION: ThemeProvider self-wrapping
const BadButton3 = ({ children }) => (
  <ThemeProvider theme={theme}>
    <button>{children}</button>
  </ThemeProvider>
);
```

### State-Based Styling Pattern

**Correct Implementation**:
```typescript
const StatusIndicator = styled.div<{ status: 'error' | 'warning' | 'success' }>(
  ({ theme, status }) => ({
    backgroundColor: theme.backgrounds.primary,
    padding: '8px 12px',
    borderRadius: '4px',

    // State-based semantic tokens
    ...(status === 'error' && {
      color: theme.foregrounds.error,
      backgroundColor: theme.backgrounds.error
    }),

    ...(status === 'warning' && {
      color: theme.foregrounds.warning
    }),

    ...(status === 'success' && {
      color: theme.foregrounds.success
    })
  })
);
```

### Typography Integration Pattern

**Correct Implementation**:
```typescript
const ThemedText = styled.p<{ variant?: 'primary' | 'secondary' | 'heading' }>(
  ({ theme, variant = 'primary' }) => ({
    margin: 0,

    ...(variant === 'primary' && {
      color: theme.foregrounds.primary,
      ...theme.lettering.primary
    }),

    ...(variant === 'secondary' && {
      color: theme.foregrounds.secondary,
      ...theme.lettering.secondary
    }),

    ...(variant === 'heading' && {
      color: theme.foregrounds.primary,
      ...theme.lettering.h4
    })
  })
);
```

## Migration Contract

### Component Conversion Requirements

**Pre-Conversion State**:
- Component may use `theme?.colors?.*` patterns
- Component may have ThemeProvider self-wrapping
- Tests may use direct `render()` import

**Post-Conversion Requirements**:
- Component MUST use only semantic tokens
- Component MUST NOT self-wrap with ThemeProvider
- Component MUST inherit theme from parent context
- Tests MUST use `renderWithTheme()` helper
- Component API MUST remain unchanged (zero breaking changes)

### Conversion Validation

**Required Checks**:
1. No hardcoded color values (hex, rgb, named colors)
2. No `theme?.colors?.*` references
3. No ThemeProvider self-wrapping
4. All styling uses semantic tokens
5. Tests updated to use renderWithTheme

**Automated Validation Pattern**:
```typescript
// Component file validation
const hasHardcodedColors = /\#[0-9a-fA-F]{3,6}|rgb\(|rgba\(/g;
const usesLegacyColors = /theme\?\.colors\./g;
const hasThemeProviderWrap = /<ThemeProvider/g;

// Style file validation
const usesSemanticTokens = /theme\.(backgrounds|foregrounds|borderColors|lettering)\./g;
```

## Performance Contract

### Styling Performance
- Styled components MUST use stable theme references
- Dynamic styling MUST avoid recreating style objects on each render
- Theme token access MUST be direct property access (no computed properties)

### Memory Contract
- Components MUST NOT create theme-derived objects in render functions
- Components SHOULD memoize complex theme-based calculations
- Theme objects are immutable and SHOULD be treated as such

## Accessibility Contract

### Color Contrast Requirements
- Semantic tokens MUST maintain WCAG AA color contrast ratios
- `foregrounds.primary` on `backgrounds.primary` MUST meet 4.5:1 ratio
- `foregrounds.secondary` on `backgrounds.primary` MUST meet 3:1 ratio
- Error states MUST maintain appropriate contrast for visibility

### Theme Switching Accessibility
- Theme changes MUST NOT break focus management
- Theme changes MUST NOT cause layout shift
- Screen readers MUST be notified of theme changes when relevant