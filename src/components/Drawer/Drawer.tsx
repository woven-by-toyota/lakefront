import { FC, ReactNode } from 'react';
import { DrawerContainer } from './drawerStyles';
import Button from 'src/components/Button/Button';
import { ReactComponent as CloseIcon } from './assets/closeIcon.svg';

export interface DrawerProps {
    /**
     * Children to display below the containers close button.
     */
    children?: ReactNode;
    /**
     * This is the initial display state of the component. When true, the drawer will be displayed.
     * When false, the drawer will be hidden.
     */
    open: boolean;
    /**
     * This is an action to run when the drawer is closed.
     */
    onClose(): void;
    /**
     * This is the width for the drawer.
     */
    width?: string | number;
    /**
     * These are the classes that would be applied to drawer.
     */
    className?: string;
    /**
     * These are the classes for the toolbar.
     */
    toolbarClasses?: string;
}

/**
 * The Drawer Component
 *
 * The Drawer component can be used to open the drawer and show the contents of the drawer.
 * The component takes drawer props. The open prop controls the visibility of the component.
 * 
 * Usage: Place this next to a flex container that has flex: 1
 */

const Drawer: FC<DrawerProps> = ({ children, className, open = false, onClose, width = '50%', toolbarClasses }) => {
    return (
        <DrawerContainer className={className} width={width} open={open}>
            <div className="innerDrawerContainer">
                <div className={toolbarClasses}>
                    <div>
                        <Button alternate className="closeIcon" aria-label="Close" onClick={onClose} icon={<CloseIcon />} />
                    </div>
                </div>
                {children}
            </div>
        </DrawerContainer>
    );
};

export default Drawer;
