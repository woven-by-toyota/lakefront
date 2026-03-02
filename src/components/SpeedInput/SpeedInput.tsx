import { FC, useState, ChangeEvent } from 'react';
import RadioGroup from 'src/components/RadioGroup/RadioGroup';
import MinMaxInput from 'src/components/Filter/modules/DurationFilter/MinMaxInput';
import { RadioGroupWrapper } from 'src/components/SpeedInput/speedInputStyles';

export enum Mode {
    minmax = 'minmax',
    presets = 'presets'
}

export interface VehicleSpeed {
    min?: number;
    max?: number;
    unit: SPEED_UNITS;
    mode: Mode;
    preset?: string;
}

/**
 * Enumerator for units of speed abbreviations
 */
export enum SPEED_UNITS {
    kilometersPerHour = 'kph',
    milesPerHour = 'mph',
    metersPerSecondSquared = 'm/s²'
}
const unitOptions = [
    { value: SPEED_UNITS.kilometersPerHour, label: 'Kph' },
    { value: SPEED_UNITS.milesPerHour, label: 'Mph' }
];

export interface SpeedInputProps {
    /**
    *  The value prop is assigned to 'VehicleSpeed', which is made up of a 'min', 'max' for the input values. A 'unit'(SPEED_UNITS) which is currently a toggle between 'kph', 'mph', or 'm/s²'. And 'mode' which uses 'minmax' for both input values. 
    */
    value: VehicleSpeed | null;
    /**
    * The function that should run when a radio button is selected.
    */
    onChange(speedRange: VehicleSpeed | null): void;
    /**
    * Toggle true, to have speed units validated for selected unit.
    */
    unitConversionRequired: boolean;
    /**
    * Toggle to accept negative input values or not.  
    */
    allowNegativeInput: boolean;
    /**
    * We can set our defaultUnits with (kilometersPerHour(kph), milesPerHour(mph), metersPerSecondSquared(m/s²)). 
    * These values determine if the unitConversionRequired needs to validate the conversion or not.   
    */
    defaultUnits: SPEED_UNITS;
    /**
    * If true, this prop will disable the radio buttons. 
    */
    disabled: boolean;
}
type Output = null | {
    min?: number,
    max?: number
}
/**
 *
 * The SpeedInput component takes in RadioGroup and MinMaxInput to create one component. 
 * This component is used for input values also to toggle between radio buttons to convert input to a range. 
 *
 */
const SpeedInput: FC<SpeedInputProps> = ({ value, onChange, unitConversionRequired, allowNegativeInput, defaultUnits, disabled }) => {
    const [unit, setUnit] = useState<string>(() => {
        if (unitConversionRequired) {
            return value && value.unit ? value.unit : defaultUnits;
        }
        return SPEED_UNITS.metersPerSecondSquared;
    });

    const handleUnitChange = (event: ChangeEvent<HTMLInputElement>) => {
        const unitVal = event.target.value;
        setUnit(unitVal);
        const speedRange: VehicleSpeed = {
            ...value,
            unit: unitVal as SPEED_UNITS,
            mode: Mode.minmax
        };
        if ((value?.min || value?.min === 0) && value?.max) {
            onChange(speedRange);
        }
    };

    const submitSearch = (output?: Output) => {
        const min = output && output?.min;
        const max = output && output?.max;
        if (min || max) {
            let speedRange: VehicleSpeed = {
                min: min || 0,
                max: max || undefined,
                unit: unit as SPEED_UNITS,
                mode: Mode.minmax
            };
            onChange(speedRange);
        } else {
            onChange(null);
        }
    };

    return (
        <>
            <MinMaxInput value={value} onChange={submitSearch} allowNegativeInput={allowNegativeInput} />
            {unitConversionRequired && (
                <>
                    <div className='unitOfSpeed'>Unit of Speed</div>
                    <RadioGroupWrapper>
                        <RadioGroup
                            name="SpeedUnits"
                            options={unitOptions}
                            value={unit}
                            disabled={disabled}
                            onChange={handleUnitChange}
                        />
                    </RadioGroupWrapper>
                </>
            )}
        </>
    );
};
export default SpeedInput;
