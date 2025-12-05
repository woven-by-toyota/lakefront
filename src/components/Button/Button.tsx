import { FC } from 'react';
import ButtonVariants from './buttonVariants';
import IconButton from './IconButton';
import {
  ButtonComponentProps,
  ICON_BUTTON_COLOR,
  ICON_SVGS,
  InvalidButtonColorError,
  shouldUseMappedIcon
} from './buttonUtil';
import { StyledDiv } from './buttonStyles';

/**
 * Button Component
 *
 * The Button component takes in native button props along with color, alternate, icon, and iconPosition props.
 * The color prop, which defaults to primary, determines its overall color scheme.
 * The alternate prop inverts the color scheme to look better on dark backgrounds.
 * className will properly apply itself, but the CSS may need to be more specific,
 * such as button.MyClass instead of just .MyClass.
 * The icon prop can be of several types. If it is an svg, that svg will be used. If it
 * is strictly "true", we will apply the default icon based on the provided color. In the future, if it is a string,
 * we will attempt to convert it into an icon. When icon is defined, the position can be specified via the iconPosition prop.
 */
const Button: FC<ButtonComponentProps> = ({
  alternate = false,
  color = 'primary',
  children,
  icon = false,
  iconPosition = 'left',
  iconLabel = '',
  ...props
}) => {
  // When an icon is supplied we need to render the IconButton component inside the Button
  if (icon) {
    // If icon is true, we need to show the icon associated with the button color type, such as add or delete
    const defaultIcon = shouldUseMappedIcon(icon)
      ? ICON_SVGS[color ?? 'primary']
      : icon;
    const isIconOnly = !children || !defaultIcon;

    // Icon Buttons have a different color mapping, i.e. there is no secondary, but primary uses the secondary component
    const ButtonComponent = isIconOnly
      ? ButtonVariants[ICON_BUTTON_COLOR[color]]
      : ButtonVariants[color];

    // Show a meaningful error when the color doesn't match our allowed color strings instead of crashing the page
    if (!ButtonComponent) {
      throw new InvalidButtonColorError(color);
    }

    if (iconLabel) {
      const { className, ...rest } = props;
      return (
          <StyledDiv className={className} disable={props.disabled ?? false}>
            <ButtonComponent
              alternate={alternate}
              {...rest}
              isIconOnly={isIconOnly}
            >
              <IconButton icon={defaultIcon} iconPosition={iconPosition}>
                {children}
              </IconButton>
            </ButtonComponent>
            <div className="icon-label">{iconLabel}</div>
          </StyledDiv>
      );
    }
    return (
        <ButtonComponent
          alternate={alternate}
          {...props}
          isIconOnly={isIconOnly}
        >
          <IconButton icon={defaultIcon} iconPosition={iconPosition}>
            {children}
          </IconButton>
        </ButtonComponent>
    );
  } else {
    // Like in the Icon version, we return a styled component based on the color type
    const ButtonComponent = ButtonVariants[color] || ButtonVariants.primary;

    return (
        <ButtonComponent alternate={alternate} {...props}>
          {children}
        </ButtonComponent>
    );
  }
};

export default Button;
