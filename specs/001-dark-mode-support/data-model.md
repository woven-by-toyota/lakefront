# Data Model: Universal Dark Mode Theme Support

**Date**: 2026-02-25
**Context**: Theme system data structures and relationships
**Source**: Analysis of existing theme.ts structure and component usage patterns

## Core Entities

### Theme Configuration Entity

**Description**: Complete theme object containing all styling tokens for light or dark mode
**Primary Key**: Theme variant (light/dark)
**State**: Immutable - themes are complete object replacements

**Fields**:
```typescript
interface LakefrontTheme {
  // Legacy color system (maintained for compatibility)
  colors: ColorPalette;
  borders: BorderDefinitions;
  zIndex: ZIndexMap;

  // Semantic token system (implementation target)
  backgrounds: {
    primary: string;        // Main background color
    secondary: string;      // Secondary surface color
    tertiary: string;       // Tertiary surface color
    widget: string;         // Widget/component background
    disabled: string;       // Disabled element background
    inverted: string;       // Inverted background (contrast)
    hover: string;          // Hover state background
    tinted: string;         // Lightly tinted background
    error: string;          // Error state background
    errorsInverted: string; // Inverted error background
  };

  foregrounds: {
    primary: string;        // Primary text/content color
    secondary: string;      // Secondary text color
    error: string;          // Error state text
    alert: string;          // Alert/warning text
    disabled: string;       // Disabled element text
    info: string;           // Information text
    warning: string;        // Warning text
    inverted: string;       // Inverted text (on dark backgrounds)
    success: string;        // Success state text
    hyperlink: string;      // Link text color
    loading: string;        // Loading state color
    tableHeading: string;   // Table header text color
  };

  borderColors: {
    primary: string;        // Standard border color
    secondary: string;      // Secondary border color
    disabled: string;       // Disabled element borders
    inverted: string;       // Inverted border color
    pronounced: string;     // Emphasized border color
  };

  lettering: {
    primary: TypographyStyle;    // Base text styling
    secondary: TypographyStyle;  // Secondary text styling
    h1: TypographyStyle;         // Heading level 1
    h2: TypographyStyle;         // Heading level 2
    h3: TypographyStyle;         // Heading level 3
    h4: TypographyStyle;         // Heading level 4
    h5: TypographyStyle;         // Heading level 5
    h6: TypographyStyle;         // Heading level 6
  };
}

interface TypographyStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
}
```

**Relationships**:
- **Composes**: ColorPalette, BorderDefinitions, ZIndexMap (legacy)
- **Referenced By**: All styled components consuming theme context
- **Variants**: THEME (light mode), DARK_THEME (dark mode)

**Validation Rules**:
- All semantic token categories must be complete (no missing keys)
- Color values must be valid CSS color strings
- Typography sizes must be positive numbers
- Font weights must be valid CSS font-weight values

**State Transitions**:
```
Theme Selection: light ↔ dark (instant object replacement via ThemeProvider)
```

### Component Theme Context Entity

**Description**: Runtime theme state propagated through React component tree
**Lifecycle**: Managed by Emotion ThemeProvider
**Scope**: Application-wide or component subtree

**Fields**:
```typescript
interface ComponentThemeContext {
  currentTheme: LakefrontTheme;     // Active theme object
  themeVariant: 'light' | 'dark';  // Current theme selection
}
```

**Relationships**:
- **Provides**: Active theme to all child components
- **Consumes**: Theme selection from parent application
- **Updates**: All styled components simultaneously during theme changes

**Validation Rules**:
- currentTheme must be a complete LakefrontTheme object
- themeVariant must match currentTheme structure
- Theme changes must be atomic (no partial updates)

**State Transitions**:
```
Theme Context: [Theme Selected] → [Theme Applied] → [Components Re-styled]
```

## Entity Relationships

### Theme Application Flow

```
Application
    ↓ provides
ThemeProvider(currentTheme)
    ↓ propagates via React Context
StyledComponent
    ↓ consumes
theme.backgrounds.primary, theme.foregrounds.primary, etc.
    ↓ applies
CSS Styling
```

### Theme Token Semantic Mapping

**Background Token Usage**:
- `backgrounds.primary`: Main component backgrounds, card surfaces
- `backgrounds.secondary`: Secondary surfaces, sidebar backgrounds
- `backgrounds.widget`: Specialized widget backgrounds

**Foreground Token Usage**:
- `foregrounds.primary`: Primary text, main content
- `foregrounds.secondary`: Secondary text, labels, captions
- `foregrounds.tableHeading`: Specialized table header text

**Border Token Usage**:
- `borderColors.primary`: Standard component borders, dividers
- `borderColors.secondary`: Secondary borders, subtle separators

## Component Integration Patterns

### Styled Component Pattern

**Before (Hardcoded)**:
```typescript
const StyledComponent = styled.div(({ theme }) => ({
  backgroundColor: theme?.colors?.white,
  color: theme?.colors?.storm,
  borderColor: theme?.colors?.mercury
}));
```

**After (Semantic Tokens)**:
```typescript
const StyledComponent = styled.div(({ theme }) => ({
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  borderColor: theme.borderColors.primary
}));
```

### Component Theme Consumption

**Requirements**:
- Components must NOT wrap themselves with ThemeProvider
- Components must consume theme from parent context only
- Components must use semantic tokens, never direct color names

## Data Constraints

### Theme Completeness Constraint
- Both THEME and DARK_THEME must have identical structure
- All semantic token categories must be fully populated
- No undefined or null token values allowed

### Semantic Consistency Constraint
- Token names must reflect usage intent, not appearance
- `primary`/`secondary` indicates hierarchy, not specific colors
- `error`/`warning`/`success` indicate semantic meaning

### Performance Constraints
- Theme objects are immutable after creation
- Theme switching replaces entire theme object (no partial updates)
- Components re-style automatically via Emotion's theme context

## Migration State Management

### Component Conversion Status
```typescript
interface ComponentConversionStatus {
  componentName: string;
  conversionPhase: 'pending' | 'in_progress' | 'completed';
  usesSemanticTokens: boolean;
  hasThemeProviderWrapping: boolean;
  testsUpdated: boolean;
}
```

**Tracking Requirements**:
- 25+ components require status tracking during conversion
- Phase-based conversion (Critical → High → Medium → Low priority)
- Automated validation of semantic token usage

This data model supports the constitutional requirement for "semantic token naming" and "complete object replacement" theme switching while maintaining backwards compatibility with existing theme structures.