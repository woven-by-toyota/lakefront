import styled from '@emotion/styled';
import { lightenDarkenColor } from 'src/styles/stylesUtil';
import { ButtonComponentProps, ComponentStyles, getTintedBackgroundColor } from './buttonUtil';
import { css, Theme } from '@emotion/react';
import { getIconStyles } from './iconButtonVariants';

const DARKEN_MOST = -40;
const DARKEN = -25;
const DARKEN_LEAST = -10;

interface ButtonConfigProps {
  isIconOnly?: boolean;
}

type StyledButtonComponentProps = ButtonComponentProps & ButtonConfigProps;

export const getColor = (theme: Theme) => {
  return {
    primary: {
      alternate: theme.foregrounds.primary,
      default: theme.foregrounds.inverted,
      disabled: lightenDarkenColor(theme.foregrounds.inverted, DARKEN_MOST),
      disabledAlternate: lightenDarkenColor(theme.foregrounds.primary, DARKEN_MOST),
      icon: lightenDarkenColor(theme.foregrounds.inverted, DARKEN_MOST)
    },
    secondary: {
      alternate: theme.foregrounds.inverted,
      default: theme.foregrounds.primary,
      disabled: lightenDarkenColor(theme.foregrounds.primary, DARKEN),
      disabledAlternate: lightenDarkenColor(theme.foregrounds.primary, DARKEN_MOST),
      disabledIcon: lightenDarkenColor(theme.foregrounds.primary, DARKEN),
      disabledIconAlternate: lightenDarkenColor(theme.foregrounds.inverted, DARKEN)
    },
    destructive: {
      alternate: theme.foregrounds.inverted,
      default: theme.foregrounds.error,
      disabled: lightenDarkenColor(theme.foregrounds.inverted, DARKEN_MOST),
      disabledAlternate: theme.foregrounds.inverted
    },
    link: {
      alternate: lightenDarkenColor(theme.foregrounds.hyperlink, 10),
      default: theme.foregrounds.hyperlink,
      disabled: lightenDarkenColor(theme.foregrounds.primary, DARKEN),
      disabledAlternate: lightenDarkenColor(theme.foregrounds.primary, DARKEN_MOST),
      disabledIcon: lightenDarkenColor(theme.foregrounds.primary, DARKEN),
      disabledIconAlternate: lightenDarkenColor(theme.foregrounds.inverted, DARKEN)
    }
  };
};

export const getBackgroundColor = (theme: Theme) => {
  return {
    primary: {
      alternate: theme.backgrounds.primary,
      default: theme.backgrounds.inverted,
      disabled: theme.backgrounds.inverted,
      disabledAlternate: lightenDarkenColor(theme.backgrounds.primary, DARKEN_MOST)
    },
    secondary: {
      default: lightenDarkenColor(theme.backgrounds.primary, DARKEN_LEAST)
    },
    destructive: {
      alternate: theme.foregrounds.error,
      default: theme.backgrounds.error,
      disabled: theme.backgrounds.inverted,
      disabledAlternate: theme.foregrounds.error
    },
    link: {
      default: lightenDarkenColor(theme.backgrounds.primary, DARKEN_LEAST)
    },
  };
};

// Return an object that contains the CSS for each button's disabled styles
const getDisabledStyles = ({ alternate = false, isIconOnly, theme }: StyledButtonComponentProps & { theme: Theme }): ComponentStyles => {
  const primaryBackground = alternate ?
    getBackgroundColor(theme).primary.disabledAlternate :
    getBackgroundColor(theme).primary.disabled;
  const secondaryIconColor = alternate ?
    getColor(theme).secondary.disabledIconAlternate :
    getColor(theme).secondary.disabledIcon;

  const destructiveColor = alternate ?
    getColor(theme).destructive.disabledAlternate :
    getColor(theme).destructive.disabled;

  return {
    primary: css({
      ':disabled': {
        backgroundColor: primaryBackground,
        color: alternate ? getColor(theme).primary.disabledAlternate : getColor(theme).primary.disabled,
        cursor: 'not-allowed',
        opacity: 0.4,
        span: {
          color: alternate ? getColor(theme).primary.disabledAlternate : getColor(theme).primary.disabled
        },
        svg: {
          fill: alternate ? getColor(theme).primary.disabledAlternate : getColor(theme).primary.disabled
        }
      }
    }),
    secondary: css({
      ':disabled': {
        backgroundColor: isIconOnly ? 'transparent' : getBackgroundColor(theme).secondary.default,
        color: getColor(theme).secondary.disabled,
        cursor: 'not-allowed',
        opacity: alternate ? 0.5 : 0.25,
        span: {
          color: isIconOnly ? secondaryIconColor : getColor(theme).secondary.disabled
        },
        svg: {
          fill: isIconOnly ? secondaryIconColor : getColor(theme).secondary.disabled
        }
      }
    }),
    destructive: css({
      ':disabled': {
        backgroundColor: alternate ?
          getBackgroundColor(theme).destructive.disabledAlternate :
          getBackgroundColor(theme).destructive.disabled,
        border: 'transparent',
        color: destructiveColor,
        cursor: 'not-allowed',
        opacity: 0.4,
        span: {
          color: destructiveColor
        },
        svg: {
          fill: destructiveColor
        }
      }
    }),
    link: css({
      ':disabled': {
        backgroundColor: isIconOnly ? 'transparent' : getBackgroundColor(theme).link.default,
        border: 'transparent',
        color: alternate ? getColor(theme).link.disabledAlternate : getColor(theme).link.disabled,
        cursor: 'not-allowed',
        opacity: 0.5,
        span: {
          color: alternate ? getColor(theme).link.disabledAlternate : getColor(theme).link.disabled
        },
        svg: {
          fill: alternate ? getColor(theme).link.disabledAlternate : getColor(theme).link.disabled
        }
      }
    })
  };
};

interface hoverProps {
  alternate?: boolean;
  theme: Theme;
}

// Return an object that contains the CSS for each button's hover styles
const getHoverStyles = ({ alternate = false, theme }: hoverProps): ComponentStyles => {
  const primaryBackground = lightenDarkenColor(alternate ? theme.backgrounds.primary : theme.backgrounds.inverted, DARKEN_LEAST);
  const secondaryBackground = lightenDarkenColor(theme.backgrounds.primary, DARKEN_LEAST);
  const destructiveBackground = alternate ?
    lightenDarkenColor(theme.foregrounds.error, DARKEN_LEAST) :
    theme.foregrounds.error;

  return {
    primary: css({
      ':hover': {
        backgroundColor: primaryBackground
      }
    }),
    secondary: css({
      ':hover': {
        backgroundColor: secondaryBackground,
        ...(alternate && { color: theme.backgrounds.inverted }),
        span: {
          ...(alternate && { color: theme.backgrounds.inverted })
        },
        svg: {
          ...(alternate && { fill: theme.backgrounds.inverted })
        }
      }
    }),
    destructive: css({
      ':hover': {
        backgroundColor: destructiveBackground,
        ...(!alternate && { color: theme.backgrounds.primary }),
        span: {
          ...(!alternate && { color: theme.backgrounds.primary })
        },
        svg: {
          ...(!alternate && { fill: theme.backgrounds.primary })
        }
      }
    }),
    link: css({
      ':hover': {
        backgroundColor: getTintedBackgroundColor(theme, alternate),
      }
    })
  };
};

const MainButton = styled.button<StyledButtonComponentProps>(({ disabled, theme }) => ({
  alignItems: 'center',
  border: 'none',
  borderRadius: 4,
  boxSizing: 'border-box',
  color: theme.foregrounds.inverted,
  cursor: 'pointer',
  display: 'inline-flex',
  fontSize: 16,
  fontWeight: 400,
  height: 40,
  justifyContent: 'center',
  outline: 'none',
  minWidth: 80,
  position: 'relative',
  overflow: 'hidden',
  textDecoration: 'none',
  userSelect: 'none',
  svg: {
    fill: theme.foregrounds.inverted
  },
  ...(!disabled && {
    ':after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50%',
      transform: 'scale(10, 10)',
      opacity: 0,
      transition: 'transform .5s, opacity 1s'
    },
    ':active:after': {
      transform: 'scale(0, 0)',
      opacity: 0.3,
      transition: '0s'
    }
  })
}));

// color='primary'
const PrimaryButton = styled(MainButton)<StyledButtonComponentProps>(({ alternate, theme }) => ({
    backgroundColor: alternate ? theme.backgrounds.primary : theme.backgrounds.inverted,
    ...(alternate && {
      color: theme.backgrounds.inverted,
      svg: {
        fill: theme.backgrounds.inverted
      }
    }),
    ':after': {
      backgroundImage: `radial-gradient(circle, ${alternate ? theme.backgrounds.inverted : theme.backgrounds.primary} 12%, transparent 14%)`
    }
  }),
  (props) => !props.disabled && getHoverStyles(props).primary,
  (props) => getDisabledStyles(props).primary,
  (props) => (props.isIconOnly && getIconStyles(props).primary));

// color='secondary'
const SecondaryButton = styled(MainButton)<StyledButtonComponentProps>(({ alternate, theme }) => ({
    backgroundColor: 'transparent',
    border: `1px solid ${alternate ? theme.foregrounds.inverted : theme.foregrounds.primary}`,
    color: alternate ? theme.foregrounds.inverted : theme.foregrounds.primary,
    ':after': {
      backgroundImage: `radial-gradient(circle, ${theme.foregrounds.primary} 12%, transparent 14%)`
    },
    span: {
      color: alternate ? theme.foregrounds.inverted : theme.foregrounds.primary
    },
    svg: {
      fill: alternate ? theme.foregrounds.inverted : theme.foregrounds.primary
    }
  }),
  (props) => !props.disabled && getHoverStyles(props).secondary,
  (props) => getDisabledStyles(props).secondary,
  (props) => (props.isIconOnly && getIconStyles(props).secondary));

// color='destructive'
const DestructiveButton = styled(MainButton)<StyledButtonComponentProps>(({ alternate, theme }) => ({
    backgroundColor: alternate ? theme.backgrounds.error : theme.backgrounds.errorsInverted,
    border: alternate ? theme.backgrounds.primary : `1px solid ${theme.foregrounds.error}`,
    color: alternate ? theme.backgrounds.primary : theme.foregrounds.error,
    ':after': {
      backgroundImage: `radial-gradient(circle, ${theme.backgrounds.primary} 12%, transparent 14%)`
    },
    span: {
      color: alternate ? theme.foregrounds.inverted : theme.foregrounds.error
    },
    svg: {
      fill: alternate ? theme.foregrounds.inverted : theme.foregrounds.error
    }
  }),
  (props) => !props.disabled && getHoverStyles(props).destructive,
  (props) => getDisabledStyles(props).destructive,
  (props) => (props.isIconOnly && getIconStyles(props).destructive));

// color='link'
const LinkButton = styled(MainButton)<StyledButtonComponentProps>(({ alternate, theme }) => ({
    backgroundColor: 'transparent',
    border: 'transparent',
    color: alternate ? lightenDarkenColor(theme.foregrounds.hyperlink, 10) : theme.foregrounds.hyperlink,
    ':after': {
      backgroundImage: `radial-gradient(circle, ${theme.foregrounds.primary} 12%, transparent 14%)`
    },
    span: {
      color: alternate ? lightenDarkenColor(theme.foregrounds.hyperlink, 10) : theme.foregrounds.hyperlink
    },
    svg: {
      fill: alternate ? lightenDarkenColor(theme.foregrounds.hyperlink, 10) : theme.foregrounds.hyperlink
    }
  }),
  (props) => !props.disabled && getHoverStyles(props).link,
  (props) => getDisabledStyles(props).link,
  (props) => (props.isIconOnly && getIconStyles(props).link));

export default {
  primary: PrimaryButton,
  secondary: SecondaryButton,
  destructive: DestructiveButton,
  link: LinkButton
};
