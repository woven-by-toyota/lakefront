import styled from '@emotion/styled';
import { RadioGroupProps } from './RadioGroup';
import { ReactComponent as CheckedIcon } from './assets/radioChecked.svg';
import { ReactComponent as UncheckedIcon } from './assets/radioUnchecked.svg';

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

interface RadioIconProps {
  disabled?: boolean;
}

export const StyledCheckedIcon = styled(CheckedIcon)<RadioIconProps>(
  ({ theme, disabled }) => ({
    fill: disabled ? theme.foregrounds.disabled : theme.foregrounds.primary,
    marginLeft: 2,
  })
);

export const StyledUncheckedIcon = styled(UncheckedIcon)<RadioIconProps>(
  ({ theme, disabled }) => ({
    fill: disabled ? theme.foregrounds.disabled : theme.foregrounds.primary,
    marginLeft: 2,
  })
);
