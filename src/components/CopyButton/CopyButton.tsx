import { FC } from 'react';
import Button from 'src/components/Button/Button';
import { ButtonComponentProps } from 'src/components/Button/buttonUtil';
import copyClipboard from 'src/lib/util/copy';
import { ReactComponent as FileCopy } from './assets/fileCopy.svg';
import { CopyButtonContent } from './copyButtonStyles';

export const COPY_TEXT = 'Copy';

export interface CopyButtonProps {
    /**
     * `Default = "Copy"` The text to display within the button.
     */
    buttonText?: string;
    /**
     * The classes to pass to the bounding boxes container.
     */
    className?: string;
    /**
     * A boolean that defines whether the anchor should be disabled.
     */
    disabled?: boolean;
    /**
     * The action to run on copy success.
     */
    onCopy?: (scrollToUrl: string) => void;
    /**
     * The value to be copied to the clipboard.
     */
    valueToCopy: string;
    /**
     * This is to set the iconOnly property. If set to false, the icon and text will appear. If true, only copy icon will render.
     * By default, the IconOnly property is set to false.
     */
    iconOnly: boolean
}

/**
 * CopyButton Component
 *
 * The CopyButton component is an implementation of the [Button Component](https://woven-by-toyota.github.io/lakefront/?path=/docs/lakefront-button--all-buttons)
 * used specifically for copying provided text to the clipboard. While the default usage should suffice, various aspects can be overridden
 * due to the inheritance of many `ButtonComponentProps`.
 */
const CopyButton: FC<CopyButtonProps & Omit<ButtonComponentProps, 'onCopy'>> = ({
    buttonText = COPY_TEXT,
    children,
    disabled,
    onCopy,
    valueToCopy,
    icon,
    iconOnly = false,
    ...props
}) => {
    return (
        <Button
            disabled={disabled}
            onClick={
                disabled
                    ? undefined
                    : () => {
                        const success = copyClipboard(valueToCopy);

                        if (onCopy && success) {
                            onCopy(valueToCopy);
                        }
                    }
            }
            type="button"
            {...props}
            icon={icon || <FileCopy aria-label="File Copy" />}
        >
            {!iconOnly && <CopyButtonContent hasContent={Boolean(children || buttonText)} className="copyButtonContent">
                {children || buttonText}
            </CopyButtonContent>
            }
        </Button>
    );
};

export default CopyButton;
