import { css, Theme } from '@emotion/react';
import { lightenDarkenColor } from 'src/styles/stylesUtil';
import { ComponentStyles, getTintedBackgroundColor } from './buttonUtil';

const MAIN_STYLES = {
  border: 'none',
  minWidth: 0,
  height: 48,
  width: 48,
  borderRadius: '100%'
};

interface GetIconStylesProps {
  theme: Theme;
  alternate?: boolean;
  disabled?: boolean;
}


export const getIconStyles = ({ alternate, disabled, theme }: GetIconStylesProps): ComponentStyles => {
  const primaryBackground = lightenDarkenColor(alternate ? theme.foregrounds.inverted : theme.foregrounds.primary, -10);
  const secondaryBackground = disabled ? 'transparent' : getTintedBackgroundColor(theme, alternate);
  const destructiveBackground = alternate ?
    lightenDarkenColor(theme.backgrounds.error, -10) :
    theme.backgrounds.error;

  return {
    primary: css({
      ...MAIN_STYLES,
      ...(!disabled && {
        ':hover': {
          backgroundColor: primaryBackground
        }
      })
    }),
    secondary: css({
      ...MAIN_STYLES,
      ...(!disabled && {
        ':hover': {
          backgroundColor: secondaryBackground,
          ...(alternate && { color: theme.backgrounds.inverted }),
          span: {
            ...(alternate && { color: theme.backgrounds.inverted })
          },
          svg: {
            ...(alternate && { fill: theme.foregrounds.inverted })
          }
        }
      })
    }),
    destructive: css({
      ...MAIN_STYLES,
      ...(!disabled && {
        ':hover': {
          backgroundColor: destructiveBackground,
          span: {
            color: destructiveBackground
          }
        }
      }),
      border: `1px solid ${theme.foregrounds.error}`
    }),
    link: css({
      ...MAIN_STYLES,
      ...(!disabled && {
        ':hover': {
          backgroundColor: getTintedBackgroundColor(theme, alternate)
        }
      })
    })
  };
};
