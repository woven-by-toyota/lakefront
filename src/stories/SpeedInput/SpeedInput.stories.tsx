import { type ComponentPropsWithoutRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import SpeedInputComponent, { Mode, type SpeedInputProps, SPEED_UNITS, type VehicleSpeed } from 'src/components/SpeedInput/SpeedInput';
import { emerald } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/SpeedInput',
    component: SpeedInputComponent,
    argTypes: {
        value: {
            control: 'VehicleSpeed',
            table: {
                defaultValue: { summary: 'VehicleSpeed' },
                type: { summary: null }
            }
        },
        unitConversionRequired: {
            control: 'boolean',
            table: {
                defaultValue: { summary: true },
                type: { summary: 'boolean' }
            }
        },
        allowNegativeInput: {
            control: 'boolean',
            table: {
                defaultValue: { summary: true },
                type: { summary: 'boolean' }
            }
        },
        defaultUnits: {
            control: SPEED_UNITS,
            table: {
                defaultValue: { summary: 'Mph' },
                type: { summary: 'string' }
            }
        },
        disabled: {
            control: 'boolean',
            table: {
                defaultValue: { summary: false },
                type: { summary: 'boolean' }
            }
        }
    },
} as Meta;

const Template: StoryFn<SpeedInputProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const [speedRange, setSpeedrange] = useState<VehicleSpeed | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    const vehicleValue: VehicleSpeed = {
        min: speedRange?.min,
        max: speedRange?.max,
        unit: null,
        mode: Mode.minmax
    };

    const handleUnitChange = (speedRange: VehicleSpeed | null) => {
        setShowBanner(true);
        setSpeedrange(speedRange);
        setTimeout(() => {
            setShowBanner(false);
        }, 10000);
    };

    return (
        <>
            {showBanner && (<div
                style={{
                    minHeight: 20,
                    backgroundColor: emerald,
                    padding: 8,
                    margin: '8px 0',
                    textAlign: 'center',
                    width: '100%'
                }}
            >
                The SpeedRange value is min = {speedRange?.min || ''} {speedRange?.unit || ''} and max = {speedRange?.max || ''} {speedRange?.unit || ''}.
            </div>)}
            <SpeedInputComponent
                {...args}
                onChange={handleUnitChange}
                value={vehicleValue}
            />

        </>
    );
};

export const SpeedInput = Template.bind({});

SpeedInput.args = {

    unitConversionRequired: true,
    allowNegativeInput: true,
    defaultUnits: SPEED_UNITS.milesPerHour,
    disabled: false
};
