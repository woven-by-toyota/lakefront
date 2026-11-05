import { identity } from 'ramda';
import { type ComponentPropsWithRef, type FC, forwardRef, type ReactNode } from 'react';
import ButtonComponent, { type ButtonProps } from 'src/components/Button';
import { ButtonGroupContainer, SelectedStylesButton } from 'src/components/ButtonGroup/buttonGroupStyles';
import { addSelectedStyles } from 'src/components/ButtonGroup/buttonGroupUtil';

export type ButtonConfig = ButtonProps & { id: string; label: ReactNode };

export interface ButtonGroupProps {
    /**
     * Optional Button component slot.
     */
    Button?: FC<ButtonProps>;
    /**
     * Whether to style buttons as a connected toggle group and maintain toggle state.
     */
    mode: 'toggle' | 'group';
    /**
     * Which button (id) should be selected/active.
     */
    selectedId?: string;
    /**
     * Props for each button.
     */
    buttonConfigs: ButtonConfig[];
    /**
     * The classes to pass to the component.
     */
    className?: string;
}

/**
 * ButtonGroup Component
 *
 * The ButtonGroup component is a convenience wrapper for grouping multiple lakefront Buttons
 * to closely connect actions and/or create toggle/mode like behavior.
 *
 */
const ButtonGroup: FC<ButtonGroupProps & ComponentPropsWithRef<'div'>> = forwardRef(
    ({ Button = ButtonComponent, className, mode, selectedId = '', buttonConfigs, ...props }, ref) => {
        if (mode === 'group') {
            return (
                <ButtonGroupContainer
                    mode={mode}
                    className={className}
                    ref={ref}
                    {...props}
                >
                    {buttonConfigs.map(({ id, label, ...buttonProps }) => {
                        return (
                            <Button
                                id={id}
                                key={id}
                                {...buttonProps}
                            >
                                {label}
                            </Button>
                        );
                    })}
                </ButtonGroupContainer>
            );
        }

        return (
            <ButtonGroupContainer
                mode={mode}
                className={className}
                ref={ref}
                {...props}
            >
                {addSelectedStyles(buttonConfigs, selectedId).map(
                    ({ id, label, className: _className, selectedStyles, ...buttonProps }) => {
                        const selected = selectedId === id;
                        const color = selected ? 'primary' : 'secondary';
                        const className = [color, _className].filter(identity).join(' ');

                        return (
                            <SelectedStylesButton
                                id={id}
                                key={id}
                                color={color}
                                className={className}
                                selectedStyles={selectedStyles}
                                {...buttonProps}
                            >
                                {label}
                            </SelectedStylesButton>
                        );
                    }
                )}
            </ButtonGroupContainer>
        );
    }
);

export default ButtonGroup;
