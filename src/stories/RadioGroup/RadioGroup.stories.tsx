import { type ChangeEvent, type ComponentPropsWithoutRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import RadioGroup, { type RadioGroupProps } from 'src/components/RadioGroup/RadioGroup';
import DocBlock from '.storybook/DocBlock';
import { blue } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/RadioGroup',
    component: RadioGroup,
    argTypes: {
        onChange: {
            control: false
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            transformSource: (source: string) => {
                return source
                    .replace('onChange={function noRefCheck() {}}', '')
                    .replace(/\n/g, '')
                    .replace(/[ ]{2}/g, ' ');
            },
        }
    }
} as Meta;

const Template: StoryFn<RadioGroupProps & ComponentPropsWithoutRef<'input'>> = (args) => {
    const [value, setValue] = useState('');

    const handleClick = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <RadioGroup
            name={args.name}
            options={args.options}
            value={value}
            disabled={args.disabled}
            onChange={handleClick}
        />
    );
};

export const StandardRadioGroup = Template.bind({});
StandardRadioGroup.args = {
    name: 'alphabet',
    options: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' }
    ]
};

export const SingleDisabledRadioGroupOption = Template.bind({});
SingleDisabledRadioGroupOption.args = {
    name: 'cells',
    options: [
        { label: 'A1', value: 'A1' },
        { label: 'B2', value: 'B2', disabled: true },
        { label: 'C3', value: 'C3' }
    ],
};

export const AllDisabledRadioGroup = Template.bind({});
AllDisabledRadioGroup.args = {
    name: 'states',
    options: [
        { label: 'AL', value: 'AL' },
        { label: 'AK', value: 'AK' },
        { label: 'AZ', value: 'AZ' }
    ],
    disabled: true
};

export const MixedContentRadioGroup = Template.bind({});
const contentStyle = { height: '2em', width: '4em', borderRadius: 2 };
MixedContentRadioGroup.args = {
  name: 'mixedContent',
  options: [
    { label: 'A', value: 'A' },
    {
      label: <div style={{ ...contentStyle, backgroundColor: blue }} />,
      value: 'B'
    },
    {
      label: (
        <div style={{ display: 'flex', flexDirection: 'column', width: '8em' }}>
            <div>
                Choose A Game
            </div>
            <div>
            <select style={{ ...contentStyle, width: '9em', marginTop: 5 }}>
                <option key={'C1'} value={1}>
                    {'Chess'}
                </option>
                <option key={'C2'} value={1}>
                    {'Checkers'}
                </option>
            </select>
            </div>
        </div>
      ),
      value: 'C'
    }
  ]
};
