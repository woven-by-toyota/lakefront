# Semantic Token Mapping Guide

**Created**: 2026-02-25
**Purpose**: Component conversion reference for migrating from hardcoded colors to semantic theme tokens
**Based on**: PR #356 (Table/Modal) successful conversion pattern

## Quick Reference Mapping

### Background Colors

| Old Pattern | New Semantic Token | Usage Context |
|-------------|-------------------|---------------|
| `theme?.colors?.white` | `theme.backgrounds.primary` | Main component backgrounds, card surfaces |
| `theme?.colors?.akoya` | `theme.backgrounds.secondary` | Secondary surfaces, sidebar backgrounds |
| `theme?.colors?.gunpowder` | `theme.backgrounds.tertiary` | Tertiary surfaces, nested content |
| `theme?.colors?.pavement` | `theme.backgrounds.widget` | Specialized widget backgrounds |
| `theme?.colors?.mercury` | `theme.backgrounds.hover` | Hover state backgrounds |
| `colors.white` (direct import) | `theme.backgrounds.primary` | Replace direct color imports |
| `#ffffff` | `theme.backgrounds.primary` | Replace hardcoded hex values |

### Foreground Colors (Text & Content)

| Old Pattern | New Semantic Token | Usage Context |
|-------------|-------------------|---------------|
| `theme?.colors?.storm` | `theme.foregrounds.primary` | Primary text, main content |
| `theme?.colors?.dolphin` | `theme.foregrounds.secondary` | Secondary text, labels, captions |
| `theme?.colors?.cinder` | `theme.foregrounds.primary` | Primary text (alternative) |
| `theme?.colors?.pavement` | `theme.foregrounds.tableHeading` | Table headers, column titles |
| `theme?.colors?.watermelon` | `theme.foregrounds.alert` | Alert icons, warning indicators |
| `theme?.colors?.saturatedRed` | `theme.foregrounds.error` | Error text, validation messages |
| `theme?.colors?.saturatedGreen` | `theme.foregrounds.success` | Success messages, positive indicators |
| `theme?.colors?.saturatedBlue` | `theme.foregrounds.hyperlink` | Clickable links |
| `colors.black` (direct import) | `theme.foregrounds.primary` | Replace direct color imports |

### Border Colors

| Old Pattern | New Semantic Token | Usage Context |
|-------------|-------------------|---------------|
| `theme?.colors?.selago` | `theme.borderColors.primary` | Standard borders, component outlines |
| `theme?.colors?.mercury` | `theme.borderColors.secondary` | Secondary borders, subtle separators |
| `theme?.colors?.dolphin` | `theme.borderColors.inverted` | Inverted border colors |
| `theme?.colors?.storm` | `theme.borderColors.pronounced` | Emphasized borders, focus states |

### Typography Integration

| Old Pattern | New Semantic Token | Usage Context |
|-------------|-------------------|---------------|
| Manual font properties | `...theme.lettering.primary` | Base text styling (spread operator) |
| Manual font properties | `...theme.lettering.secondary` | Secondary text styling |
| Heading font properties | `...theme.lettering.h4` | Component titles |
| Small heading properties | `...theme.lettering.h5` | Component subtitles |

## Conversion Patterns by Component Type

### Standard Component Pattern

**Before (Hardcoded)**:
```typescript
const StyledComponent = styled.div(({ theme }) => ({
  backgroundColor: theme?.colors?.white,
  color: theme?.colors?.storm,
  borderColor: theme?.colors?.mercury,
  fontSize: 14,
  fontFamily: 'Arial, sans-serif',
  fontWeight: 400
}));
```

**After (Semantic Tokens)**:
```typescript
const StyledComponent = styled.div(({ theme }) => ({
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  borderColor: theme.borderColors.primary,
  ...theme.lettering.primary
}));
```

### Interactive Component Pattern

**Before (Hardcoded with States)**:
```typescript
const StyledButton = styled.button(({ theme, disabled }) => ({
  backgroundColor: theme?.colors?.white,
  color: theme?.colors?.storm,
  border: `1px solid ${theme?.colors?.mercury}`,

  '&:hover': {
    backgroundColor: theme?.colors?.akoya
  },

  '&:disabled': {
    backgroundColor: theme?.colors?.mercury,
    color: theme?.colors?.pavement
  }
}));
```

**After (Semantic Tokens with States)**:
```typescript
const StyledButton = styled.button(({ theme, disabled }) => ({
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  border: `1px solid ${theme.borderColors.primary}`,
  ...theme.lettering.primary,

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

### Table/Data Component Pattern

**Before (Hardcoded)**:
```typescript
const StyledTableHeader = styled.th(({ theme }) => ({
  backgroundColor: theme?.colors?.white,
  color: theme?.colors?.pavement,
  borderBottom: `1px solid ${theme?.colors?.selago}`
}));
```

**After (Semantic Tokens)**:
```typescript
const StyledTableHeader = styled.th(({ theme }) => ({
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.tableHeading,
  borderBottom: `1px solid ${theme.borderColors.primary}`
}));
```

### Error/Alert Component Pattern

**Before (Hardcoded)**:
```typescript
const StyledAlert = styled.div(({ theme, type }) => ({
  backgroundColor: theme?.colors?.white,
  color: type === 'error' ? theme?.colors?.saturatedRed : theme?.colors?.storm,
  borderLeft: `4px solid ${type === 'error' ? theme?.colors?.watermelon : theme?.colors?.akoya}`
}));
```

**After (Semantic Tokens)**:
```typescript
const StyledAlert = styled.div(({ theme, type }) => ({
  backgroundColor: theme.backgrounds.primary,
  color: type === 'error' ? theme.foregrounds.error : theme.foregrounds.primary,
  borderLeft: `4px solid ${type === 'error' ? theme.foregrounds.alert : theme.borderColors.primary}`,
  ...theme.lettering.primary
}));
```

## Component-Specific Migration Patterns

### Remove ThemeProvider Wrapping

**Before (Self-Wrapping)**:
```typescript
const MyComponent = ({ children, ...props }) => (
  <ThemeProvider theme={theme}>
    <StyledWrapper {...props}>
      {children}
    </StyledWrapper>
  </ThemeProvider>
);
```

**After (Parent Theme Inheritance)**:
```typescript
const MyComponent = ({ children, ...props }) => (
  <StyledWrapper {...props}>
    {children}
  </StyledWrapper>
);
```

### Replace Direct Color Imports

**Before (Direct Import)**:
```typescript
import colors from 'src/styles/lakefrontColors';

const StyledComponent = styled.div({
  backgroundColor: colors.white,
  color: colors.storm
});
```

**After (Theme Context)**:
```typescript
const StyledComponent = styled.div(({ theme }) => ({
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary
}));
```

## Testing Pattern Updates

### Test Import Pattern

**Before (Direct RTL)**:
```typescript
import { render } from '@testing-library/react';
```

**After (Theme-Aware Render)**:
```typescript
import { renderWithTheme as render } from 'src/lib/testing';
```

### Test Implementation Pattern

**Before (No Theme Context)**:
```typescript
it('renders correctly', () => {
  const { container } = render(<MyComponent />);
  expect(container).toMatchSnapshot();
});
```

**After (Dual-Theme Testing)**:
```typescript
it('renders correctly in light theme', () => {
  const { container } = render(<MyComponent />);
  expect(container).toMatchSnapshot('light-theme');
});

it('renders correctly in dark theme', () => {
  const { container } = render(<MyComponent />, 'dark');
  expect(container).toMatchSnapshot('dark-theme');
});
```

## Validation Checklist

After converting each component, verify:

- [ ] **No hardcoded colors**: Search for `#[0-9a-fA-F]`, `rgb(`, `theme?.colors?`
- [ ] **No ThemeProvider wrapping**: Search for `<ThemeProvider`
- [ ] **No direct color imports**: Search for `from.*lakefrontColors`
- [ ] **Semantic tokens used**: All colors use `theme.backgrounds.*`, `theme.foregrounds.*`, `theme.borderColors.*`
- [ ] **Typography integrated**: Font properties use `...theme.lettering.*`
- [ ] **Tests updated**: All tests use `renderWithTheme`
- [ ] **Both themes work**: Component renders correctly in light and dark modes
- [ ] **Interactive states work**: Hover, disabled, focus states work in both themes

## Troubleshooting Common Issues

### Issue: Component doesn't inherit theme

**Problem**: Component not receiving theme context
**Solution**: Ensure no ThemeProvider wrapper, parent has ThemeProvider

### Issue: Colors look wrong in dark theme

**Problem**: Using wrong semantic token for context
**Solution**: Use semantic meaning (primary/secondary) not color appearance

### Issue: Tests failing after conversion

**Problem**: Tests not using theme context
**Solution**: Replace `render` with `renderWithTheme`

### Issue: TypeScript errors on theme properties

**Problem**: Optional chaining on required properties
**Solution**: Use direct property access (`theme.backgrounds.primary` not `theme?.backgrounds?.primary`)

## Performance Considerations

- **Use stable theme references**: Don't recreate theme objects in render
- **Avoid dynamic token creation**: Use existing semantic tokens
- **Leverage Emotion's theme caching**: Theme objects are memoized automatically
- **Minimize theme-dependent calculations**: Pre-calculate values where possible

This guide ensures consistent, maintainable dark mode support across all Lakefront components.