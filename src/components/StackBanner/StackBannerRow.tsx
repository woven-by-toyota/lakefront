import type { ComponentPropsWithoutRef, FC, MouseEvent, ReactNode } from 'react';
import { StackBannerRowDiv } from './stackBannerStyles';
import { getStackBannerIcon, type StackBannerIcon } from './stackBannerUtil';

export interface StackBannerRowProps {
    /**
     * A unique string key required for React list item changes.
     */
    key: string;
    /**
     * The main content to be displayed in the banner.
     */
    content?: ReactNode;
    /**
     * The svg icon to display. If a svg is provided, the svg will be used.
     * If explicitly true or left undefined, a default flag icon will be displayed.
     * If explicitly false, no icon will be displayed.
     */
    icon?: StackBannerIcon;
    /**
     * The severity of the content that maps to varying background color levels.
     * If left undefined, the background will be transparent.
     */
    severity?: 'normal' | 'warning' | 'error' | 'default';
    /**
     * The action to run when the banner is clicked.
     */
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    /**
     * The classes to pass to the stack banner row.
     */
    className?: string;
}

/**
 * StackBannerRow Component
 *
 * The StackBannerRow component takes in content, icon, severity, and onClick props. It is
 * designed to be used with a StackBanner component, but can be used as a standalone component.
 *
 */
const StackBannerRow: FC<StackBannerRowProps & Omit<ComponentPropsWithoutRef<'div'>, 'content'>> = ({
    content = '',
    icon = true,
    severity = 'default',
    onClick = () => null,
    ...props
}) => {
    const svg = getStackBannerIcon(icon);

    return (
        <StackBannerRowDiv
            className='stackBannerRow'
            severity={severity}
            onClick={onClick}
            {...props}
        >
            {svg}
            <div className='content'>{content}</div>
        </StackBannerRowDiv>
    );
};

export default StackBannerRow;
