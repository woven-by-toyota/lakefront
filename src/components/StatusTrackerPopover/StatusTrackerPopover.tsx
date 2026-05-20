import { FC, ReactNode, useMemo, useState } from 'react';
import StatusTracker, { StatusItem } from '../StatusTracker';
import { StyledStatusTrackerPopoverWrapper, StyledStatusTrackerPopover } from './statusTrackerPopoverStyles';
import usePopover, { PortalStyles, PopoverContent } from 'src/lib/hooks/usePopover';

export interface StatusTrackerPopoverProps {
    /**
     * Array of status items to display.
     */
    statuses: StatusItem[];
    /**
     * Children to render within popover wrapper (typically a button or trigger element).
     */
    children?: ReactNode;
    /**
     * Determines whether the popover is visible.
     */
    visible: boolean;
    /**
     * This is the id to assign to the appended div when rendering in a portal.
     * This defaults to `lakefront-portal-container`.
     */
    portalId?: string;
    /**
     * When true, the component will mount a div to the body and render the popover through it.
     * This is useful when the popover would be inside a scrollable container or one with "overflow: hidden"
     * so it doesn't get cut off. Uses IntersectionObserver and needs a polyfill if IE compatibility is needed.
     */
    renderInPortal?: boolean;
    /**
     * The classes to pass to the component.
     */
    className?: string;
    /**
     * Optional width of the popover.
     */
    width?: string | number;
}

/**
 * StatusTrackerPopover Component
 *
 * The StatusTrackerPopover component displays a StatusTracker in a popover at the bottom of the children.
 * The state is not managed inside this component and visible needs to be maintained in the parent component.
 * When used inside a scrollable or "overflow: hidden" element it may get cut off. When this is an issue,
 * use the "renderInPortal" prop which appends a div to the body and positions the component to the correct coordinates.
 *
 */
const StatusTrackerPopover: FC<StatusTrackerPopoverProps> = ({
    statuses,
    children,
    visible = false,
    portalId,
    renderInPortal = false,
    className,
    width
}) => {
    const [popoverElement, setPopoverElement] = useState<HTMLElement | null>(null);
    const portalStyles: PortalStyles = useMemo(() => {
        const className = 'status-tracker-popover-portal';

        if (popoverElement) {
            const { left, bottom, width } = popoverElement.getBoundingClientRect();

            return {
                className,
                styles: {
                    position: 'absolute',
                    left: `${left + (width / 2)}px`,
                    top: `${bottom + window.scrollY}px`
                }
            };
        }

        return {
            className
        };
    }, [popoverElement, window.scrollY]);

    const { portal } = usePopover({
        popoverContainer: popoverElement,
        portalStyles,
        portalId,
        renderInPortal
    });

    const popoverNodeMounted = (node: HTMLDivElement) => {
        setPopoverElement(node);
    };

    return (
        <StyledStatusTrackerPopoverWrapper ref={popoverNodeMounted} className={className}>
            {children}
            <PopoverContent portal={portal} deps={[children, statuses]}>
                {visible && statuses.length > 0 && (
                    <StyledStatusTrackerPopover className='status-tracker-popover' width={width}>
                        <StatusTracker statuses={statuses} />
                    </StyledStatusTrackerPopover>
                )}
            </PopoverContent>
        </StyledStatusTrackerPopoverWrapper>
    );
};

export default StatusTrackerPopover;
