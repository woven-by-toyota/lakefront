import React from 'react';
import { ReactComponent as Flag } from '../assets/flag.svg';
import {
  NORMAL_SEVERITY,
  WARNING_SEVERITY,
  ERROR_SEVERITY,
  DEFAULT_SEVERITY,
  DEFAULT_BACKGROUND_COLOR,
  getSeverityColor,
  getStackBannerIcon,
} from '../stackBannerUtil';

const THEME = {
  backgrounds: {
    primary: 'white',
    warning: 'orange',
    error: 'red',
  },
};

describe('getSeverityColor', () => {
  it('returns the proper severity color when severity is defined.', () => {
    expect(getSeverityColor(NORMAL_SEVERITY, THEME)).toBe(THEME.backgrounds.primary);
    expect(getSeverityColor(WARNING_SEVERITY, THEME)).toBe(THEME.backgrounds.warning);
    expect(getSeverityColor(ERROR_SEVERITY, THEME)).toBe(THEME.backgrounds.error);
    expect(getSeverityColor(DEFAULT_SEVERITY, THEME)).toBe(DEFAULT_BACKGROUND_COLOR);
  });

  it('returns the proper default color when severity is undefined.', () => {
    expect(getSeverityColor(undefined, THEME)).toBe(DEFAULT_BACKGROUND_COLOR);
  });

  it('returns the proper default color when severity is invalid.', () => {
    expect(getSeverityColor('doesNotExist', THEME)).toBe(DEFAULT_BACKGROUND_COLOR);
  });
});

describe('getStackBannerIcon', () => {
  it('returns the flag icon when icon is true', () => {
    expect(getStackBannerIcon(true)).toEqual(<Flag />);
  });

  it('returns undefined when icon is false', () => {
    expect(getStackBannerIcon(false)).toBe(false);
  });

  it('returns the provided svg when provided.', () => {
    expect(getStackBannerIcon(<Flag />)).toEqual(<Flag />);
  });

  it('returns the flag icon when icon is undefined', () => {
    expect(getStackBannerIcon()).toEqual(<Flag />);
  });
});
