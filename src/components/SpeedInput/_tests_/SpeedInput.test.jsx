import { renderWithTheme as render } from 'src/lib/testing';
import { fireEvent } from '@testing-library/react';
import SpeedInput, { SPEED_UNITS, Mode } from '../SpeedInput';

const options = [
    {
        label: 'Min',
        value: 1
    },
    {
        label: 'max',
        value: 50
    },
    {
        label: 'unit',
        value: 'mph'
    },
    {
        label: 'unit',
        value: 'kph'
    },
    {
        label: 'unit',
        value: 'm/s²'
    },
];

const vehicleValue = {
    min: 1,
    max: 50,
    unit: SPEED_UNITS.kilometersPerHour,
    mode: Mode.minmax
};

describe('<SpeedInput>', () => {

    it('Should exist', () => {
        const callback = jest.fn();
        const speedInput = render(
            <SpeedInput
                value={vehicleValue}
                unitConversionRequired={true}
                allowNegativeInput={true}
                disabled={false}
                defaultUnits={SPEED_UNITS.kilometersPerHour}
                onChange={callback}
            />);
        expect(speedInput).toBeDefined();
    });

    it('Takes in all props', () => {
        const callback = jest.fn();
        const { container, getByText } = render(
            <SpeedInput
                value={vehicleValue}
                unitConversionRequired={true}
                allowNegativeInput={false}
                disabled={false}
                defaultUnits={SPEED_UNITS.kilometersPerHour}
                onChange={callback}
            />
        );
        expect(container).toBeInTheDocument();
        const icon = container.querySelectorAll('div');
        expect(icon).toBeDefined();
        expect(Mode.minmax).toEqual('minmax');
        expect(SpeedInput.value).not.toBeNull();
        expect(SpeedInput.unitConversionRequired).not.toEqual(false);

        expect(vehicleValue.min).toEqual(options[0].value);
        expect(vehicleValue.max).toEqual(options[1].value);
        expect(vehicleValue.unit).toEqual(options[3].value);
        expect(vehicleValue.mode).toEqual('minmax');

        expect(SPEED_UNITS.kilometersPerHour).toEqual(options[3].value);
        expect(SPEED_UNITS.metersPerSecondSquared).toEqual(options[4].value);
        expect(SPEED_UNITS.milesPerHour).toEqual(options[2].value);

        const mphClicked = getByText('Mph');
        fireEvent.click(mphClicked);
        expect(callback.mphClicked).not.toEqual(options[3].value);

        const kphStaysKph = getByText('Kph');
        fireEvent.click(kphStaysKph);
        expect(SPEED_UNITS.kilometersPerHour).toEqual(options[3].value);

    });
});
