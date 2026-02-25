# Component Dark Mode Conversion Tracking Checklist

**Created**: 2026-02-25
**Based on**: research.md findings and PR #356 conversion pattern
**Total Components**: 25+ components across 4 conversion phases

## Conversion Pattern Reference

**✅ BEFORE → AFTER Pattern**:
```typescript
// ❌ Before: Hardcoded colors and ThemeProvider wrapping
<ThemeProvider theme={theme}>
  <StyledComponent style={{
    backgroundColor: theme?.colors?.white,
    color: theme?.colors?.storm,
    borderColor: theme?.colors?.mercury
  }} />
</ThemeProvider>

// ✅ After: Semantic tokens and parent theme inheritance
<StyledComponent style={{
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  borderColor: theme.borderColors.primary
}} />
```

## Phase 1: Critical Components (Highest Impact) 🔥

**Priority**: Immediate - highest visual impact when broken

- [ ] **StatusTable** - `src/components/StatusTable/statusTableStyles.ts`
  - [ ] Convert hardcoded colors: `theme?.colors?.storm`, `theme?.colors?.white`, `theme?.colors?.mercury`
  - [ ] Update tests: `src/components/StatusTable/__tests__/statusTable.test.tsx`
  - [ ] Verify dark theme rendering
  - [ ] Status: ⏳ Pending

- [ ] **Select** - `src/components/Select/selectStyles.ts`
  - [ ] Convert hardcoded colors and overlay styles
  - [ ] Remove direct color values: `#9393a2`, `#000000`
  - [ ] Update tests: `src/components/Select/__tests__/select.test.tsx`
  - [ ] Verify dark theme rendering
  - [ ] Status: ⏳ Pending

- [ ] **PlaybackBar** - `src/components/PlaybackBar/playbackStyle.ts`
  - [ ] Convert hardcoded colors: `theme?.colors?.white`, `theme?.colors?.green`
  - [ ] Update tests: `src/components/PlaybackBar/__tests__/playbackBar.test.tsx`
  - [ ] Verify dark theme rendering
  - [ ] Status: ⏳ Pending

- [ ] **TypeaheadSearch** - `src/components/TypeaheadSearch/typeaheadSearchStyles.ts`
  - [ ] Convert hardcoded colors: `theme?.colors?.white`, `theme?.colors?.red`
  - [ ] Update tests: `src/components/TypeaheadSearch/__tests__/typeaheadSearch.test.tsx`
  - [ ] Verify dark theme rendering
  - [ ] Status: ⏳ Pending

## Phase 2: ThemeProvider Removal (Theme Inheritance Fixes) 🔧

**Priority**: High - fixes theme inheritance blocking

- [ ] **Drawer** - `src/components/Drawer/Drawer.tsx`
  - [ ] Remove `<ThemeProvider theme={theme}>` wrapper
  - [ ] Update tests: `src/components/Drawer/__tests__/drawer.test.tsx`
  - [ ] Verify theme inheritance works
  - [ ] Status: ⏳ Pending

- [ ] **Loading** - `src/components/Loading/Loading.tsx`
  - [ ] Remove `<ThemeProvider theme={theme}>` wrapper
  - [ ] Update tests: `src/components/Loading/__tests__/loading.test.tsx`
  - [ ] Verify theme inheritance works
  - [ ] Status: ⏳ Pending

- [ ] **Toggle** - `src/components/Toggle/Toggle.tsx`
  - [ ] Remove `<ThemeProvider theme={theme}>` wrapper
  - [ ] Update tests: `src/components/Toggle/__tests__/toggle.test.tsx`
  - [ ] Verify theme inheritance works
  - [ ] Status: ⏳ Pending

- [ ] **ProgressBar** - `src/components/Progress/ProgressBar.tsx`
  - [ ] Remove `<ThemeProvider theme={customTheme}>` wrapper
  - [ ] Remove hardcoded fallback: `#e1e1e8`
  - [ ] Update tests: `src/components/Progress/__tests__/progressBar.test.tsx`
  - [ ] Verify theme inheritance works
  - [ ] Status: ⏳ Pending

## Phase 3: Color Standardization (Standard Hardcoded Colors) 🎨

**Priority**: Medium - standard hardcoded color replacements

- [ ] **RadioGroup** - `src/components/RadioGroup/radioGroupStyles.ts`
  - [ ] Convert: `theme?.colors?.mercury`, `theme?.colors?.cinder`, `theme?.colors?.white`
  - [ ] Update tests: `src/components/RadioGroup/__tests__/radioGroup.test.tsx`
  - [ ] Status: ⏳ Pending

- [ ] **Checkbox** - `src/components/Checkbox/checkboxStyles.ts`
  - [ ] Convert: `theme?.colors?.mercury`, `theme?.colors?.cinder`, `theme?.colors?.white`
  - [ ] Update tests: `src/components/Checkbox/__tests__/checkbox.test.tsx`
  - [ ] Status: ⏳ Pending

- [ ] **Filter/MultiSelectFilter** - `src/components/Filter/modules/MultiSelectFilter/multiSelectStyles.ts`
  - [ ] Convert hardcoded `#ffffff` and `theme.colors.*` references
  - [ ] Update tests: `src/components/Filter/__tests__/filter.test.tsx`
  - [ ] Status: ⏳ Pending

- [ ] **Snackbar** - `src/components/Snackbar/snackbarStyles.ts`
  - [ ] Remove direct color imports: `import colors from 'src/styles/lakefrontColors'`
  - [ ] Convert `colors.black`, `colors.white` usage
  - [ ] Update tests: `src/components/Snackbar/__tests__/snackbar.test.tsx`
  - [ ] Status: ⏳ Pending

- [ ] **TransferList** - `src/components/TransferList/transferListStyles.ts`
  - [ ] Remove direct color imports: `import colors from 'src/styles/lakefrontColors'`
  - [ ] Convert `colors.white` usage
  - [ ] Update tests: `src/components/TransferList/__tests__/transferList.test.tsx`
  - [ ] Status: ⏳ Pending

## Phase 4: Polish & Optimization (Minor Updates) ✨

**Priority**: Low - minor improvements to already-working components

- [ ] **Button/ButtonVariants** - `src/components/Button/buttonVariants.ts`
  - [ ] Optimize lightenDarkenColor usage
  - [ ] Status: ⏳ Pending

- [ ] **Shadow Colors** - Multiple files
  - [ ] Fix hardcoded shadow colors throughout codebase
  - [ ] Status: ⏳ Pending

## Global Validation Tasks ✅

- [ ] **No Hardcoded Colors Remaining**
  - [ ] Run: `grep -r "theme\?\.colors\." src/components/`
  - [ ] Run: `grep -r "#[0-9a-fA-F]\{3,6\}" src/components/`
  - [ ] Status: ⏳ Pending

- [ ] **No ThemeProvider Self-Wrapping**
  - [ ] Run: `grep -r "<ThemeProvider" src/components/`
  - [ ] Status: ⏳ Pending

- [ ] **All Tests Use renderWithTheme**
  - [ ] Run: `grep -r "from '@testing-library/react'" src/components/ | grep render`
  - [ ] Status: ⏳ Pending

## Progress Summary

**Overall Progress**: 0/25+ components converted

**Phase Progress**:
- Phase 1 (Critical): 0/4 complete
- Phase 2 (ThemeProvider): 0/4 complete
- Phase 3 (Color Standardization): 0/5 complete
- Phase 4 (Polish): 0/remaining complete

**Next Priority**: Start with Phase 1 Critical Components (StatusTable, Select, PlaybackBar, TypeaheadSearch)

## Success Criteria Checklist

- [ ] All components render correctly in both light and dark themes
- [ ] No hardcoded color references remain in any component
- [ ] All components inherit theme from parent ThemeProvider (no self-wrapping)
- [ ] All component tests updated to use renderWithTheme helper
- [ ] Theme switching works seamlessly without visual artifacts
- [ ] Zero breaking changes to component APIs
- [ ] All interactive states (hover, disabled, focus) work in both themes