<!--
Sync Impact Report:
- Version change: initial → 1.0.0
- List of modified principles: All principles created for initial constitution
- Added sections: Core Principles, Development Workflow Standards, Technical Requirements, Governance
- Removed sections: None
- Templates requiring updates:
  ✅ constitution-template.md (used as source)
  ⚠ plan-template.md (Constitution Check section references this file)
  ⚠ spec-template.md (may reference constitution principles)
  ⚠ tasks-template.md (may reference constitution-driven task types)
- Follow-up TODOs: None
-->

# Lakefront Constitution

## Core Principles

### I. Component Library Architecture
All components MUST follow theme-first design consuming centralized theme tokens. TypeScript-native development with comprehensive type safety and exported interfaces is mandatory. Tree-shakeable exports MUST support individual component imports. Peer dependency model requires host applications to provide React/Emotion. SVG assets MUST be transformed to React components using SVGR.

**Rationale**: Ensures consistency across Toyota/Woven Planet applications while maintaining flexibility and performance through modular architecture.

### II. Standardized Component Development
Every component MUST use standardized folder structure (ComponentName/ComponentName.tsx, index.ts). TypeScript interfaces with JSDoc documentation are required for all components. Emotion styled-components pattern is mandatory for styling. Comprehensive test coverage using Jest + React Testing Library is non-negotiable.

**Rationale**: Maintains code quality, documentation standards, and developer experience consistency across the entire component library.

### III. Quality Gates and Testing (NON-NEGOTIABLE)
Rollup build system MUST produce both CommonJS and ESM outputs. Jest testing with canvas/SVG mocking is required for all components. Storybook documentation MUST exist for every component. ESLint + TypeScript + React rules must pass. Semantic versioning with automated keyword-triggered bumps is mandatory.

**Rationale**: Ensures reliability, compatibility, and maintainability of the component library across different consumption patterns.

### IV. Theme System Consistency
Semantic token naming MUST be used (foregrounds.primary not colors.gray900). Light/dark themes MUST be complete object replacements. Theme structure MUST be TypeScript-enforced. Components MUST consume theme tokens, never direct colors. Custom named colors (storm, akoya, gunpowder) maintain design system coherence.

**Rationale**: Provides consistent theming capability across applications while supporting multiple theme variants and maintaining design system integrity.

### V. Distribution and Integration Standards
Single NPM package (@woven-planet/lakefront) with centralized exports via src/index.ts. Generated TypeScript definitions MUST be included in distribution. SVG assets MUST be bundled as React components. Consumer applications MUST use React 18+, Emotion ThemeProvider wrapper, and specified peer dependencies (React, Emotion, D3, Ramda).

**Rationale**: Ensures consistent integration experience and compatibility requirements across consuming applications.

## Development Workflow Standards

Semantic versioning with keyword-triggered automation governs all releases. Breaking changes MUST use major version bumps with migration guides. Feature additions use minor versions, bug fixes use patch versions.

Documentation strategy includes Storybook for live component documentation, README with visual component catalog and screenshots, TypeScript self-documenting interfaces, and GitHub PR templates with workflow automation.

All components MUST be added to the central component table in README.md with links to Storybook documentation and visual screenshots stored in src/screenshots/.

## Technical Requirements

**Core Stack Requirements**: React 18 with TypeScript strict mode, Emotion CSS-in-JS for styling and theming, dual theme system with light/dark mode built-in, component composition pattern with props-based customization.

**Build and Development Tools**: Rollup for library bundling producing both CommonJS and ESM outputs, Jest + React Testing Library for testing with canvas/SVG mocking, Storybook 9.x for component documentation, ESLint with TypeScript and React plugins for code quality, Prettier for consistent code formatting.

**Asset Processing**: SVGR for SVG-to-React-component transformation, Terser for minification, URL loader for asset handling.

## Governance

Constitution principles supersede all other development practices and MUST be verified in all component implementations and code reviews. Architecture decisions MUST align with theme-first design and TypeScript-native approaches. Breaking changes require constitution compliance review and migration planning.

All new components MUST follow standardized folder structure, include comprehensive TypeScript interfaces with JSDoc documentation, implement Storybook stories, and maintain test coverage. Complexity introductions MUST be justified against simpler alternatives.

**Version**: 1.0.0 | **Ratified**: 2026-02-19 | **Last Amended**: 2026-02-19