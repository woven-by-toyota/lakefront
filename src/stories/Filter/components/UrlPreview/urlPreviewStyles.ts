import styled from '@emotion/styled';
import Input from 'src/components/Input/Input';

export const PreviewBar = styled(Input)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  span: {
    color: theme.foregrounds.primary
  }
}));

export const UrlPreviewContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  label: {
    flex: 1,
    margin: '1em'
  },
  color: theme.foregrounds.primary
}));
