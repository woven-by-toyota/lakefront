import styled from '@emotion/styled';
import { RadioGroupProps } from './RadioGroup';

interface StyledLabelProps {
  disabled?: boolean;
}

export const StyledLabel = styled.label<StyledLabelProps>(
  ({ theme, disabled }) => ({
      color: disabled ? theme.foregrounds.disabled : theme.foregrounds.primary,
      display: 'flex',
      flexDirection: 'row',
      fontSize: 16,
      padding: 0,
      marginBottom: 41,
      alignItems: 'center',
      'div.label': {
        marginLeft: 12,
        fontSize: 16
      },
      svg: {
        color: disabled ? theme.foregrounds.disabled : theme.foregrounds.inverted,
        marginLeft: 2,
        'path:nth-of-type(2)': {
          fill: disabled ? theme.foregrounds.disabled : undefined
        }
      },
      cursor: disabled ? 'not-allowed' : 'auto',
  })
);

export const StyledRadioGroup = styled.input<RadioGroupProps>(
  ({ disabled }) => ({
      display: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
  })
);
