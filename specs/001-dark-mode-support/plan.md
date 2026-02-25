# Implementation Plan: Universal Dark Mode Theme Support

**Branch**: `001-dark-mode-support` | **Date**: 2026-02-25 | **Spec**: [spec.md](/Users/jeff.morris/projects/lakefront/specs/001-dark-mode-support/spec.md)
**Input**: Feature specification from `/specs/001-dark-mode-support/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Enable universal dark mode support across all Lakefront components by converting from hardcoded theme wrapping and color references to semantic theme tokens. Components should consume theme context from parent ThemeProvider rather than wrapping themselves. Technical approach follows the pattern established in PR #356 for Table and Modal components: remove individual ThemeProvider wrappers, convert hardcoded colors to semantic tokens (e.g., `theme.backgrounds.primary`, `theme.foregrounds.primary`), and ensure seamless theme switching without component API changes.

## Technical Context

**Language/Version**: TypeScript 4.2.3, React 18.2.0
**Primary Dependencies**: @emotion/react ^11.10.6, @emotion/styled ^11.10.6, React 18.2.0
**Storage**: N/A (component library)
**Testing**: Jest 26.6.3 with @testing-library/react ^14.0.0 and @testing-library/jest-dom ^5.11.9
**Target Platform**: Web browsers (React component library for consumption)
**Project Type**: Component library - single NPM package with tree-shakable exports
**Performance Goals**: Instantaneous theme switching without visual artifacts or re-renders
**Constraints**: Zero breaking changes to component APIs, maintain backwards compatibility, preserve existing component functionality
**Scale/Scope**: 50+ React components across the Lakefront library requiring theme token conversion

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Component Architecture**: Theme-first design with centralized tokens already exists (THEME and DARK_THEME objects in src/styles/theme.ts)
- [x] **TypeScript Standards**: Comprehensive type safety already implemented with TypeScript 4.2.3, existing interfaces documented
- [x] **Quality Gates**: Build (Rollup), testing (Jest+RTL), documentation (Storybook) already configured and operational
- [ ] **Theme Consistency**: THIS IS THE IMPLEMENTATION TARGET - convert components to use semantic tokens instead of direct color references
- [x] **Distribution Standards**: Single @woven-planet/lakefront package with centralized exports and peer dependencies already established

**Constitution Status**: ✅ PASSED - Only theme consistency remains to be implemented, which is the exact goal of this feature

**Post-Phase 1 Re-evaluation** (2026-02-25):
- [x] **Component Architecture**: ✅ CONFIRMED - Theme-first design maintained, semantic tokens fully documented in data-model.md
- [x] **TypeScript Standards**: ✅ CONFIRMED - All interfaces documented, type safety preserved, zero breaking changes to component APIs
- [x] **Quality Gates**: ✅ CONFIRMED - Testing strategy documented in contracts/testing-contract.md, maintains Jest+RTL and Storybook patterns
- [x] **Theme Consistency**: ✅ PLANNED - Complete implementation strategy documented across research.md, contracts/, and quickstart.md
- [x] **Distribution Standards**: ✅ CONFIRMED - Single package structure preserved, peer dependencies unchanged

**Final Constitutional Compliance**: ✅ FULLY COMPLIANT - Implementation plan adheres to all constitutional principles while achieving universal dark mode support

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/           # All React components requiring theme token conversion
│   ├── Button/
│   ├── Card/
│   ├── Drawer/
│   ├── Input/
│   ├── Loading/
│   ├── Modal/           # ✅ Already converted in PR #356
│   ├── Table/           # ✅ Already converted in PR #356
│   └── [50+ other components]/
├── styles/
│   ├── theme.ts         # THEME and DARK_THEME definitions (already complete)
│   ├── lakefrontColors.ts
│   └── [other style files]/
├── lib/
│   └── testing.ts       # renderWithTheme helper for tests
└── types/
    └── global.ts        # LakefrontTheme interface definitions

stories/                 # Storybook documentation
├── [Component]/
└── [Component].stories.tsx

dist/                    # Rollup build output (CJS + ESM)
├── index.cjs.js
├── index.esm.js
└── index.cjs.d.ts
```

**Structure Decision**: Single NPM package structure optimized for component library distribution. All theme-related infrastructure already exists; implementation focuses on converting individual component styled-components to consume semantic theme tokens rather than hardcoded colors.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
