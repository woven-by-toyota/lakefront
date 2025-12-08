import styled from '@emotion/styled';

interface StyledDivProps {
  disable: boolean;
}

export const StyledDiv = styled('div')<StyledDivProps>(({ disable, theme }) => ({
  display: 'inline-block',
  textAlign: 'center',
  '& > div.icon-label': { color: disable ? theme.foregrounds.disabled : theme.foregrounds.primary }
}));
