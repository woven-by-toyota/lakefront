import { type FC, useEffect, useRef, useState } from 'react';
import { type MenuItem, PopoverContent, usePopover } from '../../index';
import Button from '../Button';
import { ActionsMenuContainer } from './moreActionsButonStyles';
import { ReactComponent as MoreIcon } from './assets/more_horiz.svg';
import { StyledMenuItem, StyledSeparator } from '../ContextMenu/contextMenuStyles';

export interface MoreActionsButtonProps {
    items: MenuItem[];
}

const MoreActionsButton: FC<MoreActionsButtonProps> = ({ items }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const { portal } = usePopover({
        popoverContainer: triggerRef.current,
        renderInPortal: true,
    });

    const handleButtonClick = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position the menu below the button, aligned to the right edge
            setPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right + window.scrollX - 180,
            });
        }
        setIsVisible(!isVisible);
    };

    const handleItemClick = (onClick: () => void) => {
        onClick();
        setIsVisible(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                isVisible &&
                menuRef.current && !menuRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)
            ) {
                setIsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isVisible]);

    return (
        <>
            <div ref={triggerRef} style={{display: 'inline-block'}}>
            <Button
                icon={<MoreIcon />}
                onClick={handleButtonClick}
                aria-label="More actions"
            />
            </div>
            <PopoverContent portal={portal} deps={[items, isVisible, position]}>
                {isVisible && (
                    <ActionsMenuContainer ref={menuRef} top={position.top} left={position.left}>
                        {items.map(((item, index) => {
                            if (item.isSeparator) {
                                return <StyledSeparator key={`separator-${index}`} />;
                            }
                            return (
                                <StyledMenuItem
                                    key={item.key}
                                    disabled={item.disabled ?? false}
                                    onClick={() => !item.disabled && handleItemClick(item.onClick)}
                                >
                                    {item.label}
                                </StyledMenuItem>
                            );
                        }))}
                    </ActionsMenuContainer>
                )}
            </PopoverContent>
        </>
    );
};

export default MoreActionsButton;
