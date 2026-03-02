import { FC, ReactElement, ReactNode, useMemo, useState } from 'react';
import { SelectPopoverItem, StyledSelectPopover, StyledSelectPopoverWrapper } from './selectPopoverStyles';
import usePopover, { PortalStyles, PopoverContent } from 'src/lib/hooks/usePopover';

export interface SelectPopoverOption {
    name: ReactElement | string;
    value: unknown;
    key?: string;
    disabled?: boolean;
}

export interface SelectPopoverProps {
    /**
     * Called on click with the value of the option that was clicked.
     */
    handleClick(value: unknown): void;
    /**
     * Children to render within popover wrapper.
     */
    children?: ReactNode;
    /**
     * Options to be mapped to items in the dropdown.
     */
    options: SelectPopoverOption[];
    /**
     * Determines whether the popover is visible. A key can be provided if the name is not unique.
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
     * The classes to pass to the select popover.
     */
    className?: string;
}

/**
 * Select Popover Component
 *
 * The Select Popover component is a select-style component that displays like a popover at the bottom of the children.
 * The state is not managed inside this component and visible needs to be maintained in the parent component.
 * When used inside a scrollable or "overflow: hidden" element it may get cut off. When this is an issue,
 * use the "renderInPortal" prop which appends a div to the body and positions the component to the correct coordinates.
 *
 */
const SelectPopover: FC<SelectPopoverProps> = (
    {
        children,
        options,
        handleClick,
        portalId,
        renderInPortal = false,
        visible = false,
        className
    }) => {
    const [popoverElement, setPopoverElement] = useState<HTMLElement | null>(null);
    const portalStyles: PortalStyles = useMemo(() => {
        const className = 'select-popover-portal';

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
        <StyledSelectPopoverWrapper ref={popoverNodeMounted} className={className}>
            {children}
            <PopoverContent portal={portal} deps={[children, options]}>
                {visible && options.length > 0 && (<StyledSelectPopover>
                        {options.map(({ name, value, key, disabled }) => (<SelectPopoverItem
                                key={key ?? name.toString()}
                                onClick={() => !disabled && handleClick(value)}
                                disabled={disabled}
                            >
                                {name}
                            </SelectPopoverItem>))}
                    </StyledSelectPopover>)}
            </PopoverContent>
        </StyledSelectPopoverWrapper>
    );
};

export default SelectPopover;
