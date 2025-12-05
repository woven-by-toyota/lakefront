import { ComponentProps, FC, ReactNode } from 'react';
import { StyledPage } from './pageStyles';

export interface PageProps {
  /**
   * The children to display within the styled page container.
   */
  children?: ReactNode;
  /**
   * These are the classes that would be applied to the Page component.
   */
  className?: string;
}

/**
 * Page Component
 *
 * The Page Component can be used to render other child components.
 */
const Page: FC<PageProps & ComponentProps<'div'>> = ({ children, className, ...rest }) => {
  return (
    <StyledPage className={className} {...rest}>
      {children}
    </StyledPage>
  );
};

export default Page;
