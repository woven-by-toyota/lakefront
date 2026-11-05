import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { useState } from 'react';
import ToggleComponent, { type ToggleProps } from 'src/components/Toggle/Toggle';
import type { SelectOption } from 'src/types/global';

export default {
    title: 'Lakefront/Toggle',
    component: ToggleComponent,
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

const toggleOptions: SelectOption<string>[] = [
    {
        label: 'First',
        value: 'first'
    },
    {
        label: 'Second',
        value: 'second'
    }
];

const Template: StoryFn<ToggleProps<string>> = (args) => {
    const [selected, setSelected] = useState(toggleOptions[0].value);
    const handleChange = (value: string) => {
        setSelected(value);

        args.onChange(value);
    };

    return (
        <ToggleComponent
            options={args.options}
            disabled={args.disabled}
            position={args.position}
            value={selected}
            onChange={handleChange}
        />
    );
};

export const Toggle = Template.bind({});
Toggle.args = {
    options: toggleOptions
};
