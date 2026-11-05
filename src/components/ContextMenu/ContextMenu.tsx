import {
    type FC,
    useState,
    useEffect,
    type MouseEvent,
    type ElementType,
    type ReactElement,
    useRef, type ReactNode
} from 'react';
import { StyledContextMenu, StyledSeparator, StyledMenuItem } from './contextMenuStyles';
import usePopover, { PopoverContent } from 'src/lib/hooks/usePopover';

type ClickableMenuItem = {
    key: string;
    label: ReactNode;
    onClick: () => void;
    isSeparator?: false;
    disabled?: boolean;
};

type SeparatorMenuItem = {
    isSeparator: true;
};

export type MenuItem = ClickableMenuItem | SeparatorMenuItem;

export interface ContextMenuProps {
    /** The content that will trigger the context menu on right-click. */
    children: ReactElement;
    /** An array of menu item objects to be displayed. */
    menuItems: MenuItem[];
    /** The component or HTML tag to use as the wrapper. Defaults to 'div'. */
    wrapper?: ElementType;
    /**
     * When true, the component will mount a div to the body and render the dialog through it.
     * This is useful when the dialog would be inside a scrollable container or one with "overflow: hidden"
     * so it doesn't get cut off. Uses IntersectionObserver and needs a polyfill if IE compatibility is needed. This
     * defaults to `false`.
     */
    renderInPortal?: boolean;
}

export const ContextMenu: FC<ContextMenuProps> = ({ children, menuItems = [], wrapper: Wrapper = 'div', renderInPortal = false, ...props }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const { portal } = usePopover({
        popoverContainer: triggerElement,
        renderInPortal: renderInPortal
    });

    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setPosition({ x: event.clientX, y: event.clientY });
        setIsVisible(true);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleClick = (onClickFunc: () => void) => {
        onClickFunc();
        handleClose();
    };

    useEffect(() => {
        const handleOutsideClick = (event: globalThis.MouseEvent) => {
            if (isVisible && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isVisible]);

    return (
        <>
            <Wrapper ref={setTriggerElement} onContextMenu={handleContextMenu} {...props}>
                {children}
            </Wrapper>
            <PopoverContent portal={portal} deps={[menuItems, isVisible, position]}>
                {isVisible && (
                    <StyledContextMenu top={position.y} left={position.x} ref={menuRef} onContextMenu={(e) => e.stopPropagation()}>
                        {menuItems.map((item, index) => {
                            if (item.isSeparator) {
                                return <StyledSeparator key={`separator-${index}`}/>;
                            }
                            return (
                                <StyledMenuItem
                                    key={item.key}
                                    onClick={() => !item.disabled && handleClick(item.onClick)}
                                    disabled={item.disabled}
                                >
                                    {item.label}
                                </StyledMenuItem>
                            );
                        })}
                    </StyledContextMenu>
                )}
            </PopoverContent>
        </>
    );
};

export default ContextMenu;
