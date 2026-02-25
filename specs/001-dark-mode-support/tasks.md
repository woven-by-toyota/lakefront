# Tasks: Universal Dark Mode Theme Support

**Input**: Design documents from `/specs/001-dark-mode-support/`
**Prerequisites**: plan.md (tech stack, project structure), spec.md (user stories P1-P3), research.md (component analysis), data-model.md (theme entities), contracts/ (theming patterns)

**Tests**: Tests are included as they are critical for theme validation across 25+ components

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project validation and prerequisite verification

- [x] T001 Validate existing theme infrastructure in `src/styles/theme.ts` contains complete THEME and DARK_THEME objects
- [x] T002 [P] Verify renderWithTheme helper exists in `src/lib/testing.ts` for theme-aware test rendering
- [x] T003 [P] Confirm Storybook configuration supports theme switching in `.storybook/` directory
- [x] T004 Create component conversion tracking checklist based on research.md findings

---

## Phase 2: Foundational (Theme System Validation)

**Purpose**: Core theme system validation that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Validate semantic token completeness across all theme categories in `src/styles/theme.ts`
- [x] T006 [P] Create theme token validation utility in `src/lib/themeValidation.ts`
- [x] T007 [P] Verify theme TypeScript interface definitions in `src/types/global.ts`
- [x] T008 Run comprehensive theme structure validation tests
- [x] T009 Document semantic token mapping patterns for component conversion reference

**Checkpoint**: Theme system validated - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Developer Uses Components with Dark Theme (Priority: P1) 🎯 MVP

**Goal**: Convert critical and high-priority components to use semantic theme tokens, enabling developers to use all components with dark theme without component-specific customizations

**Independent Test**: Import any converted component, wrap with ThemeProvider using DARK_THEME, verify it renders correctly with dark theme styling that matches the design system

### Critical Components Conversion (Highest Impact)

- [x] T010 [P] [US1] Convert StatusTable component hardcoded colors to semantic tokens in `src/components/StatusTable/statusTableStyles.ts`
- [x] T011 [P] [US1] Update StatusTable component tests to use renderWithTheme in `src/components/StatusTable/__tests__/statusTable.test.tsx`
- [x] T012 [P] [US1] Convert Select component hardcoded colors to semantic tokens in `src/components/Select/selectStyles.ts`
- [x] T013 [P] [US1] Update Select component tests to use renderWithTheme in `src/components/Select/__tests__/select.test.tsx`
- [x] T014 [P] [US1] Convert PlaybackBar component hardcoded colors to semantic tokens in `src/components/PlaybackBar/playbackStyle.ts`
- [x] T015 [P] [US1] Update PlaybackBar component tests to use renderWithTheme in `src/components/PlaybackBar/__tests__/playbackBar.test.tsx`
- [x] T016 [P] [US1] Convert TypeaheadSearch component hardcoded colors to semantic tokens in `src/components/TypeaheadSearch/typeaheadSearchStyles.ts`
- [x] T017 [P] [US1] Update TypeaheadSearch component tests to use renderWithTheme in `src/components/TypeaheadSearch/__tests__/typeaheadSearch.test.tsx`

### ThemeProvider Removal (Theme Inheritance Fixes)

- [x] T018 [P] [US1] Remove ThemeProvider wrapper from Drawer component in `src/components/Drawer/Drawer.tsx`
- [x] T019 [P] [US1] Update Drawer component tests to use renderWithTheme in `src/components/Drawer/__tests__/drawer.test.tsx`
- [x] T020 [P] [US1] Remove ThemeProvider wrapper from Loading component in `src/components/Loading/Loading.tsx`
- [x] T021 [P] [US1] Update Loading component tests to use renderWithTheme in `src/components/Loading/__tests__/loading.test.tsx`
- [x] T022 [P] [US1] Remove ThemeProvider wrapper from Toggle component in `src/components/Toggle/Toggle.tsx`
- [x] T023 [P] [US1] Update Toggle component tests to use renderWithTheme in `src/components/Toggle/__tests__/toggle.test.tsx`
- [x] T024 [P] [US1] Remove ThemeProvider wrapper from ProgressBar component in `src/components/Progress/ProgressBar.tsx`
- [x] T025 [P] [US1] Update ProgressBar component tests to use renderWithTheme in `src/components/Progress/__tests__/progressBar.test.tsx`

### Color Standardization Components

- [x] T026 [P] [US1] Convert RadioGroup component hardcoded colors to semantic tokens in `src/components/RadioGroup/radioGroupStyles.ts`
- [x] T027 [P] [US1] Update RadioGroup component tests to use renderWithTheme in `src/components/RadioGroup/__tests__/radioGroup.test.tsx`
- [x] T028 [P] [US1] Convert Checkbox component hardcoded colors to semantic tokens in `src/components/Checkbox/checkboxStyles.ts`
- [x] T029 [P] [US1] Update Checkbox component tests to use renderWithTheme in `src/components/Checkbox/__tests__/checkbox.test.tsx`
- [x] T030 [P] [US1] Convert Filter components hardcoded colors to semantic tokens in `src/components/Filter/modules/MultiSelectFilter/multiSelectStyles.ts`
- [x] T031 [P] [US1] Update Filter component tests to use renderWithTheme in `src/components/Filter/__tests__/filter.test.tsx`
- [x] T032 [P] [US1] Convert Snackbar component hardcoded colors and direct imports in `src/components/Snackbar/snackbarStyles.ts`
- [x] T033 [P] [US1] Update Snackbar component tests to use renderWithTheme in `src/components/Snackbar/__tests__/snackbar.test.tsx`
- [x] T034 [P] [US1] Convert TransferList component hardcoded colors and direct imports in `src/components/TransferList/transferListStyles.ts`
- [x] T035 [P] [US1] Update TransferList component tests to use renderWithTheme in `src/components/TransferList/__tests__/transferList.test.tsx` (No tests exist)

### Component Conversion Validation

- [x] T036 [US1] Run all converted component tests with both light and dark themes to verify proper rendering
- [x] T037 [US1] Validate no hardcoded color references remain in converted components using grep validation
- [x] T038 [US1] Test component functionality preservation - ensure all interactive states work in both themes

**Checkpoint**: At this point, all critical components should render correctly in both light and dark themes, User Story 1 should be fully functional and testable independently

---



## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Component conversion tasks marked [P] can run in parallel (different files)
- Test updates marked [P] can run in parallel with their corresponding component conversions
- Validation tasks must run after component conversions complete
- Each component conversion should be tested immediately after completion

### Parallel Opportunities

- **Setup Phase**: T002 and T003 can run in parallel
- **Foundational Phase**: T006 and T007 can run in parallel
- **User Story 1**: All component conversions (T010-T035) can run in parallel as they affect different files
- **Different User Stories**: Can be worked on by different team members simultaneously after Foundational phase

---

## Parallel Example: User Story 1

```bash
# Launch all critical component conversions together:
Task: "Convert StatusTable component hardcoded colors to semantic tokens in src/components/StatusTable/statusTableStyles.ts"
Task: "Convert Select component hardcoded colors to semantic tokens in src/components/Select/selectStyles.ts"
Task: "Convert PlaybackBar component hardcoded colors to semantic tokens in src/components/PlaybackBar/playbackStyle.ts"
Task: "Convert TypeaheadSearch component hardcoded colors to semantic tokens in src/components/TypeaheadSearch/typeaheadSearchStyles.ts"

# Launch all test updates in parallel with conversions:
Task: "Update StatusTable component tests to use renderWithTheme in src/components/StatusTable/__tests__/statusTable.test.tsx"
Task: "Update Select component tests to use renderWithTheme in src/components/Select/__tests__/select.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (4 tasks)
2. Complete Phase 2: Foundational (5 tasks) - CRITICAL blocker
3. Complete Phase 3: User Story 1 (29 tasks) - Core component conversions
4. **STOP and VALIDATE**: Test all converted components in both themes independently
5. Deploy/demo theme support for critical components

### Incremental Delivery

1. Complete Setup + Foundational → Theme system validated (9 tasks)
2. Add User Story 1 → Critical components support dark theme → Deploy/Demo (MVP! - 38 tasks total)
3. Each story adds value without breaking previous functionality

### Parallel Team Strategy

With multiple developers after Foundational phase completion:

1. **Developer A**: Focus on Critical Components (T010-T017)
2. **Developer B**: Focus on ThemeProvider Removal (T018-T025)
3. **Developer C**: Focus on Color Standardization (T026-T035)

---

## Summary

- **Total Tasks**: 74 tasks across 6 phases
- **MVP Scope**: Phase 1-3 (38 tasks) - Core dark theme support
- **User Story 1**: 29 component conversion tasks (25+ components)
- **Parallel Opportunities**: 45+ tasks can run in parallel within their phases
- **Critical Path**: Setup → Foundational → Component Conversions → Validation
- **Zero Breaking Changes**: All component APIs remain identical throughout conversion