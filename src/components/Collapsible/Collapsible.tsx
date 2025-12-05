import {
  ComponentPropsWithoutRef,
  FC,
  ReactElement,
  useState
} from 'react';
import { StyledCollapsible } from './collapsibleStyles';
import Button from 'src/components/Button/Button';
import { ReactComponent as ChevronUp } from './assets/chevron-up.svg';
import { ReactComponent as ChevronDown } from './assets/chevron-down.svg';

export interface CollapsibleProps {
  /**
   * This is the initial display state of the component. When true, the child contents will be displayed.
   * When false, the child contents will be hidden.
   */
  expanded?: boolean;
  /**
   * This is an action to run when the expand state changes.
   */
  onChange?: () => void;
  /**
   * This is an event which will trigger when the expand/collapse section is clicked.
   */
  onClick?: () => void;
  /**
   * Typically a string, this is the content to show at the top left of the component.
   */
  title?: string | ReactElement;
  /**
   * Typically a string, this is the content to show at the top right of the component.
   */
  subtitle?: string | ReactElement;
  /**
   * `Default = false` This determines if a horizontal divider should be displayed between the
   * title and the child content.
   */
  divider?: boolean;
  /**
   * `Default = true` This determines if the expand/collapse icon should be displayed and usable.
   */
  collapsible?: boolean;
  /**
   * This is to render icon for expand/collapse control.
   */
  icon?: ReactElement<SVGElement> | boolean | string | undefined;
  /**
   * The classes to pass to the collapsible.
   */
  className?: string;
}

/**
 * Collapsible Component
 *
 * The Collapsible component can be used to make collapsible sections within a document.
 * The component takes in native div props as well as its own CollapsibleProps. The `expanded` prop
 * controls the initial state of the component. Once initialized, the state is managed within this component.
 *
 */
const Collapsible: FC<CollapsibleProps & Pick<ComponentPropsWithoutRef<'div'>, Exclude<keyof ComponentPropsWithoutRef<'div'>, keyof CollapsibleProps>>> = ({
  expanded = false,
  title = '',
  subtitle = '',
  divider = true,
  onChange,
  onClick,
  children,
  collapsible = true,
  icon,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleChange = () => {
    if (onChange) {
      onChange();
    }

    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledCollapsible {...props} onClick={handleClick}>
      <div className="topCollapsible">
        {icon &&
          <div className="iconWithTitle">
            <div>{icon}</div>
            <div className="title">{title}</div>
          </div>
        }
        {!icon && <div className="title">{title}</div>}
        <div className="subtitle">
          {subtitle}
          {collapsible && (<Button
            onClick={handleChange}
            icon={isExpanded ? <ChevronUp /> : <ChevronDown />}
          />)}
        </div>
      </div>
      {divider && <div className="divider" />}
      <div className={`bottomCollapsible ${isExpanded ? 'expanded' : 'collapsed'}`}>{children}</div>
    </StyledCollapsible>
  );
};

export default Collapsible;
