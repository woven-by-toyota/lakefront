import { FC } from 'react';
import { IconComponentProps } from './buttonUtil';
import styled from '@emotion/styled';

interface IconSpanProps {
  iconPosition?: 'left' | 'right';
  isIconOnly: boolean;
}

const IconSpan = styled.span<IconSpanProps>(({ iconPosition, isIconOnly }) => {
  const iconFirst = iconPosition === 'left';
  const margin = iconFirst ? 'auto 15px auto 10px' : 'auto 10px auto 15px';
  const flexDirection = iconFirst ? 'row' : 'row-reverse';

  return {
    display: 'inline-flex',
    alignItems: 'center',
    margin: isIconOnly ? undefined : margin,
    flexDirection,
    'span.iconChild': {
      display: 'inline-flex'
    }
  };
});

/**
 * Icon Component
 *
 * The Icon component takes icon and iconPosition.
 * The icon will be displayed along side any provided children.
 * The iconPosition, determines if the icon precedes or proceeds the provided children.
 *
 */
const IconButton: FC<IconComponentProps> = ({ icon, children, iconPosition }) => {
  return (
    <IconSpan iconPosition={iconPosition} isIconOnly={Boolean(!children)}>
      {<span className="iconChild">{icon}</span>}
      {children && <span className="iconChild">{children}</span>}
    </IconSpan>
  );
};

export default IconButton;
