import styled from '@emotion/styled';
import { CheckboxProps } from './Checkbox';

interface StyledLabelProps {
  disabled?: boolean;
  indeterminate?: boolean;
}

export const StyledLabel = styled.label<StyledLabelProps>(
  ({ theme, disabled, indeterminate }) => {
    const disabledSvgColor = indeterminate
      ? theme.foregrounds.inverted
      : theme.foregrounds.disabled;

    return {
      color: disabled ? theme.foregrounds.disabled : theme.foregrounds.primary,
      display: 'inline-grid',
      gridTemplateColumns: '32px auto',
      gridTemplateRows: 'auto',
      fontSize: 16,
      padding: 0,
      alignItems: 'center',
      span: {
        gridColumn: '2 / span 1',
        gridRow: '1 / span 1'
      },
      'div:first-of-type': {
        gridColumn: '2 / span 1',
        gridRow: '1 / span 1',
        fontWeight: 'bold'
      },
      'div:nth-of-type(2)': {
        gridColumn: '2 / div 1',
        gridRow: '2 / div 1',
        fontSize: 13
      },
      svg: {
        gridColumn: '1 / span 1',
        gridRow: '1 / span 1',
        color: disabled ? disabledSvgColor : theme.foregrounds.inverted,
        marginLeft: 2
      },
      cursor: disabled ? 'not-allowed' : 'auto'
    };
  }
);

export const StyledCheckbox = styled.input<CheckboxProps>(
  ({ theme, checked, indeterminate, disabled, color }) => {
    const backgroundColor =
      indeterminate || checked ? theme.backgrounds.inverted : theme.backgrounds.primary;
    const disabledBackgroundColor = indeterminate
      ? theme.backgrounds.disabled
      : theme.backgrounds.primary;

    return {
      border: `2px solid ${
        color || (disabled ? theme.borderColors.disabled : theme.borderColors.primary)
      }`,
      borderRadius: 2,
      WebkitAppearance: 'none',
      backgroundColor:
        color || (disabled ? disabledBackgroundColor : backgroundColor),
      fontSize: 16,
      outline: 'none',
      height: 20,
      width: 20,
      gridColumn: '1 / span 1',
      gridRow: '1 / span 1',
      cursor: disabled ? 'not-allowed' : 'pointer'
    };
  }
);
