import { Bar, Icon, IconWrapper, Label, ToggleWrapper } from './toggleStyles';
import { SelectOption } from 'src/types/global';

export interface ToggleProps<T> {
    /**
     * Optional className for styling component.
     */
    className?: string;
    /**
     * When true, the switch will no longer toggle.
     */
    disabled?: boolean;
    /**
     * Options for the labels and their values. It should only contain two objects.
     */
    options: SelectOption<T>[];
    /**
     * This is called whenever the switch toggles with the value of the option.
     * Clicking the label also toggles the switch.
     */
    onChange: (value: T) => void;
    /**
     * Determines which side of the switch the label is rendered.
     */
    position?: 'LEFT' | 'RIGHT';
    /**
     * The currently selected value. This value is passed in from the parent component.
     */
    value: T;
}

/**
 * Toggle Component
 *
 * The Toggle component is a switch component that displays one of two labels depending on the state of the switch.
 * It has a position prop to change the layout of the label. State for the value needs to be maintained in a parent
 * component and passed in as a prop.
 */
const Toggle = <T, >({
        className,
        disabled,
        options,
        onChange,
        position = 'RIGHT',
        value
    }: ToggleProps<T>) => {
    const [firstOption, secondOption] = options;
    const isFirstOption = value === firstOption.value;
    const iconPosition = isFirstOption ? 0 : 16;
    const label = isFirstOption ? firstOption.label : secondOption.label;
    const labelOrder = position === 'LEFT' ? 0 : 2;

    const handleToggleClick = () => {
        if (!disabled) {
            const newValue = value === firstOption.value ? secondOption.value : firstOption.value;
            onChange(newValue);
        }
    };

    if (!options || options.length === 0) {
        return null;
    }

    return (
        <ToggleWrapper className={className}>
            <Label disabled={disabled} style={{ order: labelOrder }} onClick={handleToggleClick}>{label}</Label>
            <IconWrapper disabled={disabled} position={position} onClick={handleToggleClick}>
                <Bar disabled={disabled} options={options} value={value} />
                <Icon disabled={disabled} style={{ left: iconPosition }} />
            </IconWrapper>
        </ToggleWrapper>
    );
};

export default Toggle;
