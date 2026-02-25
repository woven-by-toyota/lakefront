/**
 * Theme Token Validation Utility
 * Validates semantic theme tokens for completeness and correctness
 */

import { LakefrontTheme } from '../types/global';

/**
 * Required semantic token structure for validation
 */
const REQUIRED_TOKEN_STRUCTURE = {
  backgrounds: [
    'primary', 'secondary', 'tertiary', 'widget', 'disabled',
    'inverted', 'hover', 'tinted', 'error', 'errorsInverted'
  ],
  foregrounds: [
    'primary', 'secondary', 'error', 'alert', 'disabled', 'info',
    'warning', 'inverted', 'success', 'hyperlink', 'loading', 'tableHeading'
  ],
  borderColors: [
    'primary', 'secondary', 'disabled', 'inverted', 'pronounced'
  ],
  lettering: [
    'primary', 'secondary', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ]
};

/**
 * Validation result interface
 */
export interface ThemeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingTokens: string[];
  invalidTokens: string[];
}

/**
 * Validates if a value is a valid CSS color
 */
function isValidCSSColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;

  // Check for common CSS color formats
  const colorRegex = /^(#[0-9A-Fa-f]{3,6}|rgb\(|rgba\(|hsl\(|hsla\(|[a-zA-Z]+).*$/;
  return colorRegex.test(color.trim());
}

/**
 * Validates if a typography style object is complete
 */
function isValidTypographyStyle(style: any): boolean {
  return (
    style &&
    typeof style.fontSize === 'number' && style.fontSize > 0 &&
    typeof style.fontFamily === 'string' && style.fontFamily.length > 0 &&
    typeof style.fontWeight === 'number' && style.fontWeight >= 100 && style.fontWeight <= 900
  );
}

/**
 * Validates a theme token category for completeness
 */
function validateTokenCategory(
  category: any,
  categoryName: string,
  requiredTokens: string[]
): { errors: string[]; warnings: string[]; missing: string[]; invalid: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missing: string[] = [];
  const invalid: string[] = [];

  if (!category || typeof category !== 'object') {
    errors.push(`${categoryName} category is missing or not an object`);
    return { errors, warnings, missing, invalid };
  }

  // Check for required tokens
  requiredTokens.forEach(token => {
    if (!(token in category)) {
      missing.push(`${categoryName}.${token}`);
    } else if (categoryName === 'lettering') {
      // Special validation for typography tokens
      if (!isValidTypographyStyle(category[token])) {
        invalid.push(`${categoryName}.${token} - invalid typography style`);
      }
    } else {
      // Validate color tokens
      if (!isValidCSSColor(category[token])) {
        invalid.push(`${categoryName}.${token} - invalid CSS color: ${category[token]}`);
      }
    }
  });

  // Check for unexpected extra tokens (warnings)
  Object.keys(category).forEach(token => {
    if (!requiredTokens.includes(token)) {
      warnings.push(`${categoryName}.${token} - unexpected token (not in required structure)`);
    }
  });

  return { errors, warnings, missing, invalid };
}

/**
 * Validates a complete theme object for semantic token compliance
 */
export function validateThemeTokens(theme: LakefrontTheme): ThemeValidationResult {
  const result: ThemeValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    missingTokens: [],
    invalidTokens: []
  };

  // Validate each semantic token category
  Object.entries(REQUIRED_TOKEN_STRUCTURE).forEach(([categoryName, requiredTokens]) => {
    const categoryResult = validateTokenCategory(
      (theme as any)[categoryName],
      categoryName,
      requiredTokens
    );

    result.errors.push(...categoryResult.errors);
    result.warnings.push(...categoryResult.warnings);
    result.missingTokens.push(...categoryResult.missing);
    result.invalidTokens.push(...categoryResult.invalid);
  });

  // Set overall validation status
  result.valid = result.errors.length === 0 && result.missingTokens.length === 0 && result.invalidTokens.length === 0;

  return result;
}

/**
 * Validates that light and dark themes have identical structure
 */
export function validateThemeStructureMatch(lightTheme: LakefrontTheme, darkTheme: LakefrontTheme): ThemeValidationResult {
  const result: ThemeValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    missingTokens: [],
    invalidTokens: []
  };

  // Validate both themes individually first
  const lightResult = validateThemeTokens(lightTheme);
  const darkResult = validateThemeTokens(darkTheme);

  // Combine individual validation results
  result.errors.push(...lightResult.errors.map(e => `Light theme: ${e}`));
  result.errors.push(...darkResult.errors.map(e => `Dark theme: ${e}`));
  result.warnings.push(...lightResult.warnings, ...darkResult.warnings);
  result.missingTokens.push(...lightResult.missingTokens, ...darkResult.missingTokens);
  result.invalidTokens.push(...lightResult.invalidTokens, ...darkResult.invalidTokens);

  // Check structural consistency between themes
  Object.entries(REQUIRED_TOKEN_STRUCTURE).forEach(([categoryName, requiredTokens]) => {
    const lightCategory = (lightTheme as any)[categoryName];
    const darkCategory = (darkTheme as any)[categoryName];

    if (lightCategory && darkCategory) {
      requiredTokens.forEach(token => {
        const lightHasToken = token in lightCategory;
        const darkHasToken = token in darkCategory;

        if (lightHasToken !== darkHasToken) {
          result.errors.push(
            `Theme structure mismatch: ${categoryName}.${token} exists in ${lightHasToken ? 'light' : 'dark'} theme but not in ${lightHasToken ? 'dark' : 'light'} theme`
          );
        }
      });
    }
  });

  result.valid = result.errors.length === 0 && result.missingTokens.length === 0 && result.invalidTokens.length === 0;
  return result;
}

/**
 * Utility to check if a component is using hardcoded colors instead of semantic tokens
 */
export function checkForHardcodedColors(componentCode: string): string[] {
  const hardcodedPatterns = [
    /theme\?\.\s*colors\?\.\w+/g,           // theme?.colors?.colorName
    /theme\.\s*colors\.\w+/g,               // theme.colors.colorName
    /#[0-9A-Fa-f]{3,6}/g,                  // Hex colors
    /rgb\s*\([^)]+\)/g,                     // RGB colors
    /rgba\s*\([^)]+\)/g,                    // RGBA colors
    /hsl\s*\([^)]+\)/g,                     // HSL colors
    /hsla\s*\([^)]+\)/g,                    // HSLA colors
  ];

  const violations: string[] = [];

  hardcodedPatterns.forEach((pattern, index) => {
    const matches = componentCode.match(pattern);
    if (matches) {
      const patternName = [
        'theme.colors usage',
        'theme.colors usage (optional chaining)',
        'Hex color values',
        'RGB color values',
        'RGBA color values',
        'HSL color values',
        'HSLA color values'
      ][index];

      violations.push(...matches.map(match => `${patternName}: ${match}`));
    }
  });

  return violations;
}

/**
 * Quick validation function for testing
 */
export function validateCurrentThemes(): ThemeValidationResult {
  try {
    // Dynamic import to avoid circular dependencies
    const { default: THEME, DARK_THEME } = require('../styles/theme');
    return validateThemeStructureMatch(THEME, DARK_THEME);
  } catch (error) {
    return {
      valid: false,
      errors: [`Failed to load themes for validation: ${error}`],
      warnings: [],
      missingTokens: [],
      invalidTokens: []
    };
  }
}