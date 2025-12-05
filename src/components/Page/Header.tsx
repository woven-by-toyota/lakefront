import { FC, ReactNode } from 'react';
import { StyledHeader } from './pageStyles';

interface HeaderProps {
  /**
   * Children to display within header container.
   */
  children?: ReactNode;
  /**
   * The classes to pass to the header.
   */
  className?: string;
}

/**
 * Header Component
 *
 * The Header component is used to render the header.
 */
const Header: FC<HeaderProps> = ({ children, className }) => {
  return (
    <StyledHeader className={className}>
      {children}
    </StyledHeader>
  );
};

export default Header;
