import type { FC, ReactNode, RefAttributes } from 'react';
import type { LinkProps } from 'react-router-dom';
import Breadcrumb, { type RouteProp } from './Breadcrumb';
import { Container, Content } from './breadcrumbStyles';

export interface BreadcrumbHeaderProps {
    /**
     * This is to set the routes which includes the name of the breadcrumb that needs to be displayed.
     *  You can also set the url for the breadcrumb to navigate to the appropriate link.
     */
    routes: RouteProp[];
    /**
     * This is to set the Class on the Breadcrumb Header.
     */
    className?: string;
    /**
     * This is to set the standalone property. If set to true, this will add full width with margin
     * and a bottom border.
     */
    standalone?: boolean;
    /**
     * If set to true, this will not display any routes.
     */
    hideRoutes?: boolean;
    /**
     * Children to display as the content.
     */
    children?: ReactNode;
    /**
     * This allows you to pass your own Link connected to your application router.
     * This is most useful for applications using React-router v6 and above.
     */
    Link?: FC<LinkProps & RefAttributes<HTMLAnchorElement>>;
}

/**
 * Breadcrumb navigation trail component that can be used as a header.
 *
 * Set [standalone] to false if you want to apply your own container styling (with className
 * prop or a wrapper). Set [standalone] to true to add full-width behavior with margins and
 * a bottom border (to function as a standalone header). Defaults to true.
 */
const BreadcrumbHeader: FC<BreadcrumbHeaderProps> = ({
    routes,
    className,
    standalone = true,
    hideRoutes = false,
    children,
    Link
}) => {
    return (
        <Container
            className={className}
            standalone={standalone}
        >
            <Breadcrumb
                routes={hideRoutes ? [] : routes}
                Link={Link}
            />
            {children && <Content>{children}</Content>}
        </Container>
    );
};

export default BreadcrumbHeader;
