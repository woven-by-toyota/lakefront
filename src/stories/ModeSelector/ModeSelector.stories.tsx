import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import DocBlock from '.storybook/DocBlock';
import ModeSelectorComponent, { type ModeSelectorProps } from 'src/components/ModeSelector/ModeSelector';
import type { SelectOption } from 'src/types/global';
import lakefrontColors from '../../styles/lakefrontColors';

export default {
    title: 'Lakefront/ModeSelector',
    component: ModeSelectorComponent,
    argTypes: {
        onChange: {
            action: 'changed',
            table: {
                disable: true
            }
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const MODES: SelectOption<string>[] = [
    {
        label: 'First Mode',
        value: 'first'
    },
    {
        label: 'Second Mode',
        value: 'second'
    },
    {
        label: 'Third Mode',
        value: 'third'
    },
    {
        label: 'Fourth Mode',
        value: 'fourth'
    },
    {
        label: 'Fifth Mode',
        value: 'fifth'
    },
    {
        label: 'Sixth Mode',
        value: 'sixth'
    },
    {
        label: 'Seventh Mode',
        value: 'seventh'
    },
];

const LEGEND = [
    { label: 'First Mode', color: lakefrontColors.red },
    { label: 'Second Mode', color: lakefrontColors.blue },
    { label: 'Third Mode', color: lakefrontColors.doveGrey },
    { label: 'Fourth Mode', color: lakefrontColors.saturatedYellow },
    { label: 'Fifth Mode', color: lakefrontColors.orange },
    { label: 'Sixth Mode', color: lakefrontColors.viking },
    { label: 'Seventh Mode', color: lakefrontColors.havelockBlue },
];

const Template: StoryFn<ModeSelectorProps & { height: number }> = (args) => {
    const [selected, setSelected] = useState(MODES[0].value);
    const handleChange = (value: string) => {
        setSelected(value);

        args.onModeSelect(value);
    };

    return (
        <div style={{ height: args.height }}>
            <div style={{ height: 200 }}>
                <ModeSelectorComponent
                    title={args.title}
                    modes={args.modes}
                    selectedMode={selected}
                    onModeSelect={handleChange}
                    legend={args.legend}
                />
            </div>
        </div>
    );
};

export const SimpleModeSelector = Template.bind({});
SimpleModeSelector.args = {
    modes: MODES.slice(0,2),
    title: 'Available Modes',
    legend: LEGEND.slice(0, 2),
    height: 200
};

export const ScrollableLegendModeSelector = Template.bind({});
ScrollableLegendModeSelector.args = {
    modes: MODES,
    title: 'Many Modes',
    legend: LEGEND,
    height: 400
};
