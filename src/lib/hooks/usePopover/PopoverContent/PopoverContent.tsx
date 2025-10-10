import { FC, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface PopoverContentProps {
    /**
     * This is the (portal/outside) container to render content in. If null,
     * content will be rendered in the closest parent node.
     */
    portal: HTMLElement | null;
    /**
     * When provided, these children will be memoized and render as the content.
     */
    children?: ReactNode;
    /**
     * This is an array of dependency values to check when determining
     * if the memoized content should be recalculated. If none of the values
     * in the dependency list have changed, the content will appear as it did
     * in the last render.
     */
    deps: any[];
}

/**
 * Popover Content Component
 *
 * The PopoverContent component is a support component to the `usePopover` hook.
 * It is meant to handle the memoization of content to be rendered and logically
 * switch between rendering content within or outside a portal as needed. Under the hood,
 * all Lakefront popover components (Modal, Snackbar, et. al) utilize this component. View
 * the [PopoverContent stories source code](https://github.com/woven-by-toyota/lakefront/blob/main/src/stories/PopoverContent/PopoverContent.stories.tsx)
 * for a more detailed look on how to implement.
 */
const PopoverContent: FC<PopoverContentProps> = ({ portal, children, deps }) => {
    const memoizedChildren = useMemo(() => <>{children}</>, [...deps]);

    return <>{portal ? createPortal(memoizedChildren, portal) : memoizedChildren}</>;
};

export default PopoverContent;
