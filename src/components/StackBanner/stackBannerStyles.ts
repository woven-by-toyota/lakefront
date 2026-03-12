import styled from '@emotion/styled';
import { getSeverityColor, getSeverityForegroundColor } from './stackBannerUtil';

export const StackBannerListDiv = styled.div({
  'div.stackBannerRow': {
    marginBottom: 10,
  },
});

interface StackBannerRowDiv {
  severity?: string;
}

export const StackBannerRowDiv = styled.div<StackBannerRowDiv>(
  ({ theme, severity }) => {

    return {
      display: 'flex',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontSize: 16,
      color: getSeverityForegroundColor(severity, theme),
      backgroundColor: getSeverityColor(severity, theme),
      border:
        severity === 'normal' ? `2px solid ${theme.foregrounds.success}` : undefined,
      svg: {
        color: getSeverityForegroundColor(severity, theme),
        path: {
          fill: getSeverityForegroundColor(severity, theme),
        },
        margin: '0 10px 0 5px',
      },
    };
  }
);
