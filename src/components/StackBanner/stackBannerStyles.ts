import styled from '@emotion/styled';
import { getSeverityColor } from './stackBannerUtil';

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
      color: theme.foregrounds.primary,
      backgroundColor: getSeverityColor(severity, theme),
      border:
        severity === 'normal' ? `2px solid ${theme.foregrounds.success}` : undefined,
      svg: {
        color: theme.foregrounds.primary,
        margin: '0 10px 0 5px',
      },
    };
  }
);
